// backend/routes/tnc.js
import express from 'express';
import Tnc from '../models/Tnc.js';
import { protect, adminOnly } from './middleware.js';

export const router = express.Router();

// 1. GET ALL TNC (Public) - Diurutkan berdasarkan field 'order' atau 'id'
router.get('/tnc', async (req, res) => {
    try {
        const terms = await Tnc.find({}).sort({ order: 1, createdAt: 1 });
        
        // Format data untuk frontend
        const formattedData = terms.map(item => ({
            id: item._id,
            title: item.title,
            type: item.type,
            content: item.content
        }));

        res.status(200).json({ success: true, data: formattedData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data TNC.' });
    }
});

// 2. CREATE TNC (Admin Only)
router.post('/admin/tnc', protect, adminOnly, async (req, res) => {
    try {
        const { title, type, content, order } = req.body;
        const newTerm = await Tnc.create({ title, type, content, order });
        res.status(201).json({ success: true, data: newTerm });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal membuat TNC.' });
    }
});

// 3. UPDATE TNC (Admin Only)
router.put('/admin/tnc/:id', protect, adminOnly, async (req, res) => {
    try {
        const updatedTerm = await Tnc.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: updatedTerm });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal update TNC.' });
    }
});

// 4. DELETE TNC (Admin Only)
router.delete('/admin/tnc/:id', protect, adminOnly, async (req, res) => {
    try {
        await Tnc.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'TNC berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal hapus TNC.' });
    }
});