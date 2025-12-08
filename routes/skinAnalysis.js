// backend/routes/skinAnalysis.js
import express from 'express';
import SkinAnalysisConfig from '../models/SkinAnalysisConfig.js';
import { protect, adminOnly } from './middleware.js';

export const router = express.Router();

// 1. GET ALL CONFIGS (Admin)
router.get('/admin/skin-analysis', protect, adminOnly, async (req, res) => {
    try {
        // Populate agar kita bisa lihat nama produk/treatment di tabel admin
        const configs = await SkinAnalysisConfig.find({})
            .populate('suggestedProducts', 'name image')
            .populate('suggestedTreatments', 'title');
            
        res.status(200).json({ success: true, data: configs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data konfigurasi.' });
    }
});

// 2. GET SINGLE CONFIG (Admin - Edit Mode)
router.get('/admin/skin-analysis/:id', protect, adminOnly, async (req, res) => {
    try {
        const config = await SkinAnalysisConfig.findById(req.params.id);
        if (!config) return res.status(404).json({ message: 'Data tidak ditemukan' });
        res.status(200).json({ success: true, data: config });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error server.' });
    }
});

// 3. CREATE CONFIG (Admin)
router.post('/admin/skin-analysis', protect, adminOnly, async (req, res) => {
    try {
        const { condition, advice, suggestedProducts, suggestedTreatments } = req.body;

        const newConfig = await SkinAnalysisConfig.create({
            condition,
            advice,
            suggestedProducts: suggestedProducts || [],
            suggestedTreatments: suggestedTreatments || []
        });

        res.status(201).json({ success: true, data: newConfig });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal membuat konfigurasi.' });
    }
});

// 4. UPDATE CONFIG (Admin)
router.put('/admin/skin-analysis/:id', protect, adminOnly, async (req, res) => {
    try {
        const updatedConfig = await SkinAnalysisConfig.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.status(200).json({ success: true, data: updatedConfig });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal update konfigurasi.' });
    }
});

// 5. DELETE CONFIG (Admin)
router.delete('/admin/skin-analysis/:id', protect, adminOnly, async (req, res) => {
    try {
        await SkinAnalysisConfig.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Konfigurasi dihapus.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus.' });
    }
});