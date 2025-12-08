// backend/routes/scan.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs'; 
import fsPromises from 'fs/promises'; 
import { fileURLToPath } from 'url';
import ort from 'onnxruntime-node'; // Library AI
import sharp from 'sharp';         // Library Pemroses Gambar

// Import Middleware & Models
import { protect } from './middleware.js'; 
import History from '../models/History.js';
import SkinAnalysisConfig from '../models/SkinAnalysisConfig.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const router = express.Router();

// ==========================================
// 1. SETUP MULTER (UPLOAD GAMBAR)
// ==========================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Bukan file gambar!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// ==========================================
// 2. SETUP AI MODEL (ONNX)
// ==========================================
let session;
const modelPath = path.join(__dirname, '../ai_models/best.onnx');

async function loadModel() {
    try {
        // Cek apakah file ada
        await fsPromises.access(modelPath);
        // Load Model
        session = await ort.InferenceSession.create(modelPath);
        console.log("✅ Model YOLO (best.onnx) berhasil dimuat!");
    } catch (e) {
        console.error("⚠️ ERROR FATAL: Gagal memuat 'backend/ai_models/best.onnx'.");
        console.error("Pastikan file tersebut ada dan library 'onnxruntime-node' sudah diinstall.");
    }
}
loadModel();

// ==========================================
// 3. FUNGSI LOGIKA AI (YOLO POST-PROCESSING)
// ==========================================

// Fungsi bantuan jika AI error/belum siap (Fallback)
const getMockResult = () => {
    console.log("⚠️ Menggunakan Data Mock (Fallback)...");
    // Return data dummy jika AI gagal agar aplikasi tidak crash
    return {
        kondisi_jerawat: 'Tidak Terdeteksi',
        jumlah_jerawat: 0,
        keyakinan_model: 0,
        boxes: [], 
        rekomendasi: "Sistem AI sedang offline atau gagal memproses.",
        products: [],
        treatments: []
    };
};

async function processYoloOutput(output, imgWidth, imgHeight) {
    const boxes = [];
    const data = output.data; 
    const dims = output.dims; 
    
    if (!dims || dims.length < 3) return [];

    const numAnchors = dims[2]; 
    const numChannels = dims[1]; 

    for (let i = 0; i < numAnchors; i++) {
        let maxScore = 0;
        let classId = -1;

        // Cari score tertinggi (Class mulai index 4)
        for (let c = 4; c < numChannels; c++) {
            const score = data[c * numAnchors + i]; 
            if (score > maxScore) {
                maxScore = score;
                classId = c - 4; 
            }
        }

        if (maxScore > 0.45) { 
            const x = data[0 * numAnchors + i];
            const y = data[1 * numAnchors + i];
            const w = data[2 * numAnchors + i];
            const h = data[3 * numAnchors + i];

            const x1 = (x - w / 2) / 640 * imgWidth;
            const y1 = (y - h / 2) / 640 * imgHeight;
            const x2 = (x + w / 2) / 640 * imgWidth;
            const y2 = (y + h / 2) / 640 * imgHeight;

            boxes.push({
                x: x1,
                y: y1,
                w: x2 - x1,
                h: y2 - y1,
                label: classId === 0 ? "Acne" : "Non-Acne", 
                score: maxScore
            });
        }
    }
    return nms(boxes);
}

function nms(boxes) {
    if (boxes.length === 0) return [];
    boxes.sort((a, b) => b.score - a.score);
    const result = [];
    while (boxes.length > 0) {
        const best = boxes.shift();
        result.push(best);
        for (let i = boxes.length - 1; i >= 0; i--) {
            if (iou(best, boxes[i]) > 0.45) { 
                boxes.splice(i, 1);
            }
        }
    }
    return result;
}

function iou(boxA, boxB) {
    const xA = Math.max(boxA.x, boxB.x);
    const yA = Math.max(boxA.y, boxB.y);
    const xB = Math.min(boxA.x + boxA.w, boxB.x + boxB.w);
    const yB = Math.min(boxA.y + boxA.h, boxB.y + boxB.h);
    
    const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
    const boxAArea = boxA.w * boxA.h;
    const boxBArea = boxB.w * boxB.h;
    
    return interArea / (boxAArea + boxBArea - interArea);
}

// --- CORE INFERENCE FUNCTION ---
const runInference = async (imagePath) => {
    // Cek apakah session siap
    if (!session) {
        return getMockResult();
    }

    try {
        // 1. Preprocessing Gambar dengan Sharp
        const metadata = await sharp(imagePath).metadata();
        const origWidth = metadata.width;
        const origHeight = metadata.height;

        const { data } = await sharp(imagePath)
            .resize(640, 640, { fit: 'fill' })
            .removeAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        // 2. Konversi ke Tensor Float32
        const float32Data = new Float32Array(3 * 640 * 640);
        for (let i = 0; i < 640 * 640; i++) {
            // Normalisasi 0-255 ke 0.0-1.0
            float32Data[i] = data[i * 3 + 0] / 255.0;                
            float32Data[i + 640 * 640] = data[i * 3 + 1] / 255.0;    
            float32Data[i + 2 * 640 * 640] = data[i * 3 + 2] / 255.0; 
        }
        const inputTensor = new ort.Tensor('float32', float32Data, [1, 3, 640, 640]);

        // 3. Jalankan Model ONNX
        const feeds = {};
        feeds[session.inputNames[0]] = inputTensor;
        
        const outputMap = await session.run(feeds);
        const outputTensor = outputMap[session.outputNames[0]];

        // 4. Post-Processing (NMS & Counting)
        let boxes = await processYoloOutput(outputTensor, origWidth, origHeight);
        boxes.sort((a, b) => b.score - a.score); 

        const acneCount = boxes.filter(b => b.label === 'Acne').length;
        
        // 5. Tentukan Keparahan (Logic Manual)
        let severity = 'Kulit Bersih';
        if (acneCount > 0 && acneCount <= 5) severity = 'Berjerawat Ringan';
        else if (acneCount > 5 && acneCount <= 10) severity = 'Berjerawat Sedang';
        else if (acneCount > 10) severity = 'Berjerawat Parah';

        let finalConfidence = boxes.length > 0 ? boxes[0].score : 0.98;

        // 6. Ambil Rekomendasi dari Database (SkinAnalysisConfig)
        let advice = "Pertahankan kebersihan wajah.";
        let recommendedProducts = [];
        let recommendedTreatments = [];

        try {
            // Mencari config yang cocok dengan hasil severity
            const config = await SkinAnalysisConfig.findOne({ condition: severity })
                .populate('suggestedProducts')
                .populate('suggestedTreatments');
            
            if (config) {
                advice = config.advice;
                recommendedProducts = config.suggestedProducts || [];
                recommendedTreatments = config.suggestedTreatments || [];
            }
        } catch (dbErr) {
            console.error("Gagal ambil rekomendasi dari DB:", dbErr);
        }

        return {
            kondisi_jerawat: severity,
            jumlah_jerawat: acneCount,
            keyakinan_model: finalConfidence,
            boxes: boxes, 
            rekomendasi: advice,
            products: recommendedProducts,
            treatments: recommendedTreatments
        };

    } catch (error) {
        console.error("❌ Error Inference Fatal:", error);
        return getMockResult();
    }
};

// ==========================================
// 4. ROUTES / ENDPOINTS
// ==========================================

// --- ROUTE PUBLIC (Tanpa Login / Guest) ---
// Menggunakan AI Asli, tapi tidak simpan ke DB
router.post('/scan/public', upload.single('photo'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'Silakan upload foto.' });
    
    try {
        console.log(`📸 Public Scan Request: ${req.file.filename}`);
        const filePath = req.file.path; 
        
        // Panggil AI
        const result = await runInference(filePath);
        
        // Hapus file temp agar server tidak penuh (Opsional, aktifkan jika mau hemat storage)
        // try { await fsPromises.unlink(filePath); } catch(e){}

        res.status(200).json({ success: true, data: result });

    } catch (error) {
        console.error("Route Error:", error);
        res.status(200).json({ success: true, data: getMockResult(), message: "Fallback ke Mock" });
    }
});

// --- ROUTE MEMBER (Wajib Login) ---
// Menggunakan AI Asli DAN Simpan ke DB (History)
router.post('/scan', protect, upload.single('photo'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'Silakan upload foto.' });
    
    try {
        console.log(`📸 Member Scan Request: ${req.user._id}`);
        const filePath = req.file.path;
        
        // 1. Jalankan AI
        const result = await runInference(filePath);
        const dbConfidence = result.keyakinan_model === null ? 0 : result.keyakinan_model;

        // 2. Simpan ke History MongoDB
        const newHistory = await History.create({
            user: req.user._id,
            photo: `/uploads/${req.file.filename}`, 
            kondisi_jerawat: result.kondisi_jerawat,
            keyakinan_model: dbConfidence,
            rekomendasi_manajemen_stress: result.rekomendasi 
        });

        res.status(201).json({ 
            success: true, 
            data: { 
                ...newHistory._doc, 
                boxes: result.boxes,
                products: result.products,
                treatments: result.treatments
            } 
        });
    } catch (error) {
        console.error("Scan Route Error:", error);
        res.status(500).json({ success: false, message: 'Server error saat menyimpan history.' });
    }
});

export default router;