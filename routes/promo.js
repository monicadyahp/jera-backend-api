// backend/routes/promo.js
import express from 'express';
import Promo from '../models/Promo.js';
import { protect, adminOnly } from './middleware.js';

export const router = express.Router();

// 1. GET ALL PROMOS (Public)
router.get('/promos', async (req, res) => {
    try {
        const promos = await Promo.find({}).sort({ createdAt: -1 });
        
        // Format data agar sesuai dengan frontend (mapping _id ke id)
        const formattedData = promos.map(p => ({
            id: p._id,
            title: p.title,
            treatment: p.treatment,
            value: p.value,
            image: p.image,
            bg_color: p.bg_color
        }));

        res.status(200).json({ success: true, data: formattedData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data promo.' });
    }
});

// 2. CREATE PROMO (Admin Only)
router.post('/admin/promos', protect, adminOnly, async (req, res) => {
    try {
        const { title, treatment, value, image, bg_color } = req.body;
        const newPromo = await Promo.create({ title, treatment, value, image, bg_color });
        res.status(201).json({ success: true, data: newPromo });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal membuat promo.' });
    }
});

// 3. UPDATE PROMO (Admin Only)
router.put('/admin/promos/:id', protect, adminOnly, async (req, res) => {
    try {
        const updatedPromo = await Promo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: updatedPromo });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal update promo.' });
    }
});

// 4. DELETE PROMO (Admin Only)
router.delete('/admin/promos/:id', protect, adminOnly, async (req, res) => {
    try {
        await Promo.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Promo berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal hapus promo.' });
    }
});