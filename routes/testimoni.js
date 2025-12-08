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

// 2. CREATE TESTIMONI (Admin)
router.post('/admin/testimonials', protect, adminOnly, async (req, res) => {
    try {
        const { name, company, text, image, rating } = req.body;
        
        if (!name || !text || !image) {
            return res.status(400).json({ success: false, message: 'Nama, Pesan, dan Foto wajib diisi.' });
        }

        const newTestimoni = await Testimoni.create({
            name,
            company: company || '',
            text,
            image,
            rating: Number(rating) || 5
        });

        res.status(201).json({ success: true, data: newTestimoni });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menambah testimoni.' });
    }
});

// 3. UPDATE TESTIMONI (Admin)
router.put('/admin/testimonials/:id', protect, adminOnly, async (req, res) => {
    try {
        const testimoni = await Testimoni.findById(req.params.id);
        if (testimoni) {
            testimoni.name = req.body.name || testimoni.name;
            testimoni.company = req.body.company || testimoni.company;
            testimoni.text = req.body.text || testimoni.text;
            testimoni.image = req.body.image || testimoni.image;
            testimoni.rating = req.body.rating || testimoni.rating;

            const updated = await testimoni.save();
            res.json({ success: true, data: updated });
        } else {
            res.status(404).json({ success: false, message: 'Testimoni tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal update testimoni.' });
    }
});

// 4. DELETE TESTIMONI (Admin)
router.delete('/admin/testimonials/:id', protect, adminOnly, async (req, res) => {
    try {
        await Testimoni.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Testimoni dihapus.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal hapus testimoni.' });
    }
});