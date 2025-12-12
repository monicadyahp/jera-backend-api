// backend/routes/scan.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import ort from 'onnxruntime-node'; 
import sharp from 'sharp';
import fsPromises from 'fs/promises';

// Import Middleware & Models
import { protect } from './middleware.js'; 
import History from '../models/History.js';
import SkinAnalysisConfig from '../models/SkinAnalysisConfig.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const router = express.Router();

// ==========================================
// 1. SETUP MULTER (MEMORY STORAGE - VERCEL FRIENDLY)
// ==========================================
// PENTING: Kita simpan di RAM (buffer), bukan di Harddisk
// Ini mencegah error EROFS: read-only file system
const storage = multer.memoryStorage(); 

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
    limits: { fileSize: 4.5 * 1024 * 1024 } // Batasi 4.5MB agar memory aman
});

// ==========================================
// 2. SETUP AI MODEL
// ==========================================
let session;
// Gunakan process.cwd() agar path terbaca benar di Vercel
const modelPath = path.join(process.cwd(), 'ai_models', 'best.onnx');

async function loadModel() {
    try {
        // Cek file
        await fsPromises.access(modelPath);
        // Load session
        session = await ort.InferenceSession.create(modelPath);
        console.log("✅ Model YOLO berhasil dimuat di Vercel!");
    } catch (e) {
        console.error("⚠️ Gagal memuat model. Pastikan folder ai_models ikut ter-upload.");
        console.error(e);
    }
}
loadModel();

// ==========================================
// 3. LOGIKA AI (Disesuaikan untuk Buffer)
// ==========================================

const getMockResult = () => {
    return {
        kondisi_jerawat: 'Analisis Terbatas',
        jumlah_jerawat: 0,
        keyakinan_model: 0,
        boxes: [], 
        rekomendasi: "Sistem AI sedang offline, coba sesaat lagi.",
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
                x: x1, y: y1, w: x2 - x1, h: y2 - y1,
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
            if (iou(best, boxes[i]) > 0.45) boxes.splice(i, 1);
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
    return interArea / ((boxA.w * boxA.h) + (boxB.w * boxB.h) - interArea);
}

// --- FUNGSI UTAMA (INPUT BUFFER) ---
const runInference = async (imageBuffer) => {
    if (!session) return getMockResult();

    try {
        // Sharp membaca Buffer langsung dari RAM
        const metadata = await sharp(imageBuffer).metadata();
        const origWidth = metadata.width;
        const origHeight = metadata.height;

        const { data } = await sharp(imageBuffer)
            .resize(640, 640, { fit: 'fill' })
            .removeAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const float32Data = new Float32Array(3 * 640 * 640);
        for (let i = 0; i < 640 * 640; i++) {
            float32Data[i] = data[i * 3 + 0] / 255.0;                
            float32Data[i + 640 * 640] = data[i * 3 + 1] / 255.0;    
            float32Data[i + 2 * 640 * 640] = data[i * 3 + 2] / 255.0; 
        }
        const inputTensor = new ort.Tensor('float32', float32Data, [1, 3, 640, 640]);

        const feeds = {};
        feeds[session.inputNames[0]] = inputTensor;
        const outputMap = await session.run(feeds);
        const outputTensor = outputMap[session.outputNames[0]];

        let boxes = await processYoloOutput(outputTensor, origWidth, origHeight);
        boxes.sort((a, b) => b.score - a.score); 

        const acneCount = boxes.filter(b => b.label === 'Acne').length;
        let severity = 'Kulit Bersih';
        if (acneCount > 0 && acneCount <= 5) severity = 'Berjerawat Ringan';
        else if (acneCount > 5 && acneCount <= 10) severity = 'Berjerawat Sedang';
        else if (acneCount > 10) severity = 'Berjerawat Parah';

        let advice = "Pertahankan kebersihan wajah.";
        let recommendedProducts = [];
        let recommendedTreatments = [];

        try {
            const config = await SkinAnalysisConfig.findOne({ condition: severity })
                .populate('suggestedProducts')
                .populate('suggestedTreatments');
            if (config) {
                advice = config.advice;
                recommendedProducts = config.suggestedProducts || [];
                recommendedTreatments = config.suggestedTreatments || [];
            }
        } catch (dbErr) { console.error("DB Config Error:", dbErr); }

        return {
            kondisi_jerawat: severity,
            jumlah_jerawat: acneCount,
            keyakinan_model: boxes.length > 0 ? boxes[0].score : 0.98,
            boxes: boxes, 
            rekomendasi: advice,
            products: recommendedProducts,
            treatments: recommendedTreatments
        };

    } catch (error) {
        console.error("Inference Error:", error);
        return getMockResult();
    }
};

// ==========================================
// 4. ROUTES
// ==========================================

router.post('/scan/public', upload.single('photo'), async (req, res) => {
    // req.file.buffer ADA karena kita pakai memoryStorage
    if (!req.file) return res.status(400).json({ success: false, message: 'Silakan upload foto.' });
    
    try {
        console.log(`📸 Public Scan (Memory): ${req.file.originalname}`);
        const result = await runInference(req.file.buffer);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Route Error:", error);
        // Jangan kirim 500 jika bisa dihandle, kirim mock saja biar ga crash
        res.status(200).json({ success: true, data: getMockResult() });
    }
});

router.post('/scan', protect, upload.single('photo'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'Silakan upload foto.' });
    
    try {
        console.log(`📸 Member Scan (Memory): ${req.user._id}`);
        const result = await runInference(req.file.buffer);
        
        // PENTING: Jangan simpan path lokal (/uploads/...), karena filenya ada di RAM.
        // Kita simpan placeholder atau upload ke Cloudinary (jika ada).
        // Untuk sekarang, placeholder dulu.
        
        const newHistory = await History.create({
            user: req.user._id,
            photo: 'https://via.placeholder.com/150?text=ScanResult', // Placeholder aman
            kondisi_jerawat: result.kondisi_jerawat,
            keyakinan_model: result.keyakinan_model || 0,
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
        console.error("Member Scan Error:", error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// ==========================================
// 5. ENDPOINT REKOMENDASI (BRIDGE)
// ==========================================
// Frontend memanggil: http://localhost:3000/api/scan/recommendations
router.post('/scan/recommendations', async (req, res) => { 
    try {
        const { condition } = req.body; 
        console.log(`🔎 [BACKEND] Request Rekomendasi Masuk: ${condition}`);
        
        // Cari di Database
        const config = await SkinAnalysisConfig.findOne({ condition: condition })
            .populate('suggestedProducts')
            .populate('suggestedTreatments');

        if (!config) {
            console.log("⚠️ Data Konfigurasi tidak ditemukan di DB!");
            return res.status(200).json({
                success: true,
                advice: "Tetap jaga kebersihan wajah.",
                products: [],
                treatments: []
            });
        }

        console.log(`✅ Data ditemukan: ${config.suggestedProducts.length} Produk`);

        res.status(200).json({
            success: true,
            advice: config.advice,
            products: config.suggestedProducts,
            treatments: config.suggestedTreatments
        });

    } catch (error) {
        console.error("Error Rekomendasi:", error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});


export default router;