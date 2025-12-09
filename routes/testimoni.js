// backend/routes/testimoni.js
import express from 'express';
import Testimoni from '../models/Testimoni.js';
import { protect, adminOnly } from './middleware.js';

export const router = express.Router();

// 1. GET ALL TESTIMONIALS (Public)
router.get('/testimonials', async (req, res) => {
    try {
        const testimonials = await Testimoni.find().sort({ createdAt: -1 });
        const formattedData = testimonials.map(item => ({
            ...item._doc,
            id: item._id, 
        }));
        res.status(200).json({ success: true, data: formattedData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil testimoni.' });
    }
});

// 2. USER CREATE TESTIMONI (Baru)
router.post('/testimonials', protect, async (req, res) => {
    try {
        const { text, rating } = req.body;
        const user = req.user; // Didapat dari middleware 'protect'

        if (!text) {
            return res.status(400).json({ success: false, message: 'Isi testimoni wajib diisi.' });
        }

        // Cek apakah user sudah punya testimoni? (Opsional: batasi 1 user 1 testimoni)
        // const exist = await Testimoni.findOne({ name: user.name }); 

        const newTestimoni = await Testimoni.create({
            name: user.name,
            // Ambil company/status dari profil user, kalau kosong set '-'
            company: user.company || 'Pelanggan', 
            // Ambil foto dari profil user, kalau kosong pakai placeholder
            image: user.avatar || 'https://via.placeholder.com/150', 
            text,
            rating: Number(rating) || 5
        });

        res.status(201).json({ success: true, data: newTestimoni, message: 'Terima kasih atas ulasan Anda!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengirim testimoni.' });
    }
});

// 3. ADMIN DELETE (Tetap Ada)
router.delete('/admin/testimonials/:id', protect, adminOnly, async (req, res) => {
    try {
        await Testimoni.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Testimoni dihapus.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal hapus testimoni.' });
    }
});