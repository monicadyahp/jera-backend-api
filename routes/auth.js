import express from 'express';
import { OAuth2Client } from 'google-auth-library'; // Import client verifikasi Google
import User from '../models/User.js'; 
import { upload, generateToken } from './middleware.js'; 
import bcrypt from 'bcryptjs'; 

export const router = express.Router();

// PERBAIKAN KRITIS: Inisialisasi client menggunakan ENV
// Client ID harus ada di process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// Endpoint Registrasi (Menggunakan Mongoose)
router.post('/register', upload.single('avatar'), async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'Semua field harus diisi!' });
    }
    
    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Password dan konfirmasi tidak sama!' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ success: false, message: 'Email sudah terdaftar.' });
        }

        const user = await User.create({
            name,
            email,
            password, 
            avatar: req.file ? `/uploads/${req.file.filename}` : null,
        });

        console.log(`[DB] Pengguna baru terdaftar: ${user.email}`);

        return res.status(201).json({ success: true, message: 'Registrasi berhasil. Silakan login.', data: { name: user.name, email: user.email } });

    } catch (error) {
        console.error("DB Error during registration:", error);
        return res.status(500).json({ success: false, message: 'Gagal mendaftar ke database.' });
    }
});

// Endpoint Login (Menggunakan Mongoose)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id); 
        
        return res.status(200).json({
            success: true,
            message: 'Login Berhasil!',
            token,
            user: { 
                id: user._id.toString(), name: user.name, email: user.email, avatar: user.avatar, role: user.role
            }
        });
    } else {
        // Tambahkan log ini di backend Anda
        if (!user) {
            console.log(`[AUTH] Login Gagal: Pengguna ${email} tidak ditemukan.`);
        } else {
            console.log(`[AUTH] Login Gagal: Password salah untuk ${email}.`);
        }
        return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }
});


// Endpoint BARU: Login via Google (Verifikasi ID Token)
router.post('/auth/google', async (req, res) => {
    const { id_token } = req.body;

    if (!id_token) {
        return res.status(400).json({ success: false, message: 'ID Token tidak ditemukan.' });
    }

    try {
        // 1. Verifikasi ID Token Google
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID, // Wajib menggunakan process.env di sini
        });
        const payload = ticket.getPayload();
        
        if (!payload) {
             return res.status(401).json({ success: false, message: 'Token Google tidak valid.' });
        }

      const { email, name, picture } = payload; 
    
    // TIDAK PERLU lagi membersihkan URL Google, karena kita akan mengabaikannya

    // 2. Cek user di MongoDB
    let user = await User.findOne({ email });

    if (!user) {
        // Jika user belum ada, daftarkan (register) secara otomatis
        user = await User.create({
            name: name,
            email: email,
            password: Math.random().toString(36).slice(-8), 
            // === PERUBAHAN KRITIS 1: Paksa AVATAR ke NULL saat registrasi Google ===
            avatar: null, 
            role: 'user',
        });
        console.log(`[Google Auth] Registrasi baru dari Google: ${email}`);
    } else {
        // === PERUBAHAN KRITIS 2: Paksa AVATAR ke NULL saat login ulang Google ===
        // Abaikan avatar Google, paksa ke NULL, agar frontend menampilkan default Cloudinary.
        if (user.avatar) {
             // Hanya update jika avatar saat ini BUKAN NULL, dan ini login Google
             user.avatar = null; 
             await user.save();
             console.log(`[Google Auth] Avatar pengguna ${email} disetel ke default (null).`);
        }
        // =================================================================
    }

    // 3. Generate JWT custom Anda
    const token = generateToken(user._id);

    return res.status(200).json({
        success: true,
        token,
        user: {
            id: user._id.toString(), 
            name: user.name, 
            email: user.email, 
            avatar: user.avatar, // Ini sekarang pasti NULL
            role: user.role
        }
    });

    } catch (error) {
        console.error('Google Auth Error:', error);
        return res.status(500).json({ success: false, message: 'Gagal memverifikasi akun Google.' });
    }
});