import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path'; // Tambahkan path untuk ekstensi file
import User from '../models/User.js'; // Import User Model untuk otentikasi
import dotenv from 'dotenv'; // Pastikan dotenv di load

dotenv.config();

// --- Konfigurasi JWT & Multer ---
const JWT_SECRET = process.env.JWT_SECRET || 'FALLBACK_RAHASIA_JANGAN_DIPAKAI'; 

// Fungsi untuk membuat Token JWT
export const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '30d', // Ubah durasi sesuai kebutuhan
    });
};

// ==========================================
// 1. MIDDLEWARE PROTECT (LOGIN USER)
// ==========================================
export const protect = async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            token = authHeader.split(' ')[1];
            
            // Verifikasi token
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Ambil user tanpa password dan tambahkan ke request
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                 return res.status(401).json({ success: false, message: 'Token tidak valid, user tidak ditemukan.' });
            }

            next(); // Lanjutkan ke handler route
            
        } catch (error) {
            console.error("JWT Error:", error);
            return res.status(401).json({ success: false, message: 'Token tidak valid atau kadaluarsa.' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Akses ditolak. Tidak ada token.' });
    }
};

// ==========================================
// 2. MIDDLEWARE ADMIN ONLY (BARU)
// ==========================================
// Ini yang hilang sebelumnya menyebabkan error
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Akses ditolak. Khusus Admin.' });
    }
};

// ==========================================
// 3. MIDDLEWARE UPLOAD (MULTER)
// ==========================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Penamaan file unik: waktu-namaasli
        cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'));
    }
});

// Fungsi filter untuk menerima hanya format gambar web
const fileFilter = (req, file, cb) => {
    // Hanya izinkan image/jpeg, image/png, dan image/webp
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Format file tidak didukung. Harap gunakan JPG, PNG, atau WEBP.'), false);
    }
};

export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB
    fileFilter: fileFilter 
});