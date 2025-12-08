// backend/routes/user.js

import express from 'express';
import User from '../models/User.js';
import { protect, upload, adminOnly } from './middleware.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises'; 
import multer from 'multer'; 

// Helper untuk mendapatkan __dirname di ES Module
const __filename = fileURLToPath(import.meta.url);
const baseDir = path.join(path.dirname(__filename), '..'); 
const uploadAvatarMiddleware = upload.single('avatar');

export const router = express.Router();

// =========================================================================
// A. ENDPOINT KHUSUS ADMIN (MANAJEMEN USER) - TAMBAHKAN INI
// =========================================================================

// 1. GET ALL USERS (Admin Only)
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        // Ambil semua user, urutkan dari yang terbaru
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data user.' });
    }
});

// 2. DELETE USER (Admin Only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ success: true, message: 'User berhasil dihapus.' });
        } else {
            res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus user.' });
    }
});

// =========================================================================
// 1. ENDPOINT GANTI PASSWORD
// =========================================================================
router.put('/change-password', protect, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id; 

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Harap isi password lama dan baru.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });

        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Password lama salah.' });

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ success: true, message: 'Password berhasil diperbarui.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
    }
});

// =========================================================================
// 2. ENDPOINT UPDATE PROFIL (LENGKAP)
// =========================================================================
router.put('/:userId', protect, (req, res) => {
    uploadAvatarMiddleware(req, res, async (err) => {
        if (err) return res.status(400).json({ success: false, message: 'Error upload gambar.' });
        
        const targetId = req.params.userId;
        // Ambil semua data baru dari body
        const { name, email, gender, birthDate, address, phone } = req.body; 
        
        if (req.user._id.toString() !== targetId) {
            return res.status(403).json({ success: false, message: 'Akses ditolak.' });
        }
        
        try {
            const user = await User.findById(targetId);
            if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
            
            // Logic Upload Avatar (Tetap sama)
            if (req.file) { 
                const oldAvatarPath = user.avatar;
                if (oldAvatarPath && oldAvatarPath.startsWith('/uploads/')) {
                    try { await fs.unlink(path.join(baseDir, oldAvatarPath)); } catch (e) {}
                }
                user.avatar = `/uploads/${req.file.filename}`;
            }
            
            // --- UPDATE DATA PROFIL ---
            // Kita update field hanya jika dikirim dari frontend
            if (name) user.name = name;
            if (email) user.email = email;
            if (gender) user.gender = gender;
            if (birthDate) user.birthDate = birthDate;
            if (address) user.address = address;
            if (phone) user.phone = phone;

            await user.save();
            
            return res.status(200).json({
                success: true,
                message: 'Profil berhasil diperbarui.',
                data: { 
                    id: user._id.toString(), 
                    name: user.name, 
                    email: user.email, 
                    avatar: user.avatar, 
                    role: user.role,
                    // Return data baru juga
                    gender: user.gender,
                    birthDate: user.birthDate,
                    address: user.address,
                    phone: user.phone
                }
            });

        } catch (error) {
            console.error('Update Error:', error);
            return res.status(500).json({ success: false, message: 'Gagal memperbarui profil.' });
        }
    });
});

// =========================================================================
// 3. ENDPOINT HAPUS AVATAR (Tetap sama)
// =========================================================================
router.delete('/:id/avatar', protect, async (req, res) => {
    // ... (Kode delete avatar tetap sama seperti sebelumnya) ...
    // Saya persingkat untuk fokus ke perubahan utama
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (user && user.avatar) {
             // Logic hapus file...
             user.avatar = null;
             await user.save();
        }
        return res.status(200).json({ success: true, message: 'Avatar dihapus.' });
    } catch (e) { return res.status(500).json({ success: false }); }
});

// =========================================================================
// 4. ENDPOINT GET DATA USER (LENGKAP)
// =========================================================================
router.get('/:userId', protect, async (req, res) => {
    try {
        const targetId = req.params.userId;
        if (req.user._id.toString() !== targetId) {
             return res.status(403).json({ success: false, message: 'Akses ditolak.' });
        }
        
        const user = await User.findById(targetId).select('-password');

        if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
        
        return res.status(200).json({
            success: true,
            data: {
                id: user._id.toString(),
                name: user.name, // Nama Lengkap dari DB
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                // --- KIRIM DATA TAMBAHAN KE FRONTEND ---
                gender: user.gender,
                birthDate: user.birthDate, // Akan dikirim format ISO string
                address: user.address,
                phone: user.phone
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Gagal mengambil data user.' });
    }
});