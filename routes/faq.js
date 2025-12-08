// backend/routes/faq.js
import express from 'express';
import Faq from '../models/Faq.js';
import { protect, adminOnly } from './middleware.js';

export const router = express.Router();

// 1.b GET SINGLE FAQ BY ID (Tambahan Baru)
router.get('/faqs/:id', async (req, res) => {
    try {
        const faq = await Faq.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({ success: false, message: 'FAQ tidak ditemukan.' });
        }
        // Format agar konsisten (opsional, tapi biar aman)
        const formattedData = {
            ...faq._doc,
            id: faq._id, // Pastikan id adalah _id mongo
            slug: faq.slug 
        };
        res.status(200).json({ success: true, data: formattedData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Invalid ID.' });
    }
});

// 1. GET ALL FAQ (Public)
router.get('/faqs', async (req, res) => {
    try {
        // Urutkan berdasarkan field 'order' agar tampilan rapi
        const faqs = await Faq.find({}).sort({ order: 1 });
        
        // Format data agar persis dengan struktur yang diminta Frontend
        // Kita mapping 'slug' database menjadi 'id' di frontend agar fitur scroll tetap jalan
        const formattedData = faqs.map(f => ({
            id: f.slug,       // PENTING: Slug database jadi ID frontend
            dbId: f._id,      // Simpan ID asli mongo jika butuh edit nanti
            category: f.category,
            items: f.items
        }));

        res.status(200).json({ success: true, data: formattedData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data FAQ.' });
    }
});

// 2. CREATE FAQ SECTION (Admin)
router.post('/admin/faqs', protect, adminOnly, async (req, res) => {
    try {
        const { category, slug, items, order } = req.body;
        const newFaq = await Faq.create({ category, slug, items, order });
        res.status(201).json({ success: true, data: newFaq });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal membuat FAQ.' });
    }
});

// 3. UPDATE FAQ SECTION (Admin)
router.put('/admin/faqs/:id', protect, adminOnly, async (req, res) => {
    try {
        const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: updatedFaq });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal update FAQ.' });
    }
});

// 4. DELETE FAQ SECTION (Admin)
router.delete('/admin/faqs/:id', protect, adminOnly, async (req, res) => {
    try {
        await Faq.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'FAQ berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal hapus FAQ.' });
    }
});