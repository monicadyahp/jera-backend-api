import express from 'express';
import Treatment from '../models/Treatment.js';

export const router = express.Router();

// ==========================================
// 1. ROUTE KHUSUS ADMIN (Taruh Paling Atas)
// ==========================================

// GET All Treatments (Untuk Admin Table)
// Endpoint: /api/admin/treatments
router.get('/admin/treatments', async (req, res) => {
    try {
        // Ambil semua data, urutkan dari yang terbaru
        const treatments = await Treatment.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: treatments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST Create Treatment
// Endpoint: /api/admin/treatments
router.post('/admin/treatments', async (req, res) => {
    const treatment = new Treatment(req.body);
    try {
        const savedTreatment = await treatment.save();
        res.status(201).json({ success: true, data: savedTreatment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// PUT Update Treatment
// Endpoint: /api/admin/treatments/:id
router.put('/admin/treatments/:id', async (req, res) => {
    try {
        const updatedTreatment = await Treatment.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json({ success: true, data: updatedTreatment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE Treatment
// Endpoint: /api/admin/treatments/:id
router.delete('/admin/treatments/:id', async (req, res) => {
    try {
        await Treatment.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Treatment has been deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 2. ROUTE PUBLIC (Di Bawah Admin)
// ==========================================

// GET All Treatments (Untuk Halaman User Biasa)
// Endpoint: /api/treatments
router.get('/treatments', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const treatments = await Treatment.find(query);

        // Format data agar sesuai ekspektasi frontend user
        const formattedTreatments = treatments.map(t => ({
            ...t._doc,
            id: t._id,
        }));

        res.status(200).json(formattedTreatments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET Treatment Detail by ID
// Endpoint: /api/treatments/:id
// PENTING: Ini harus paling bawah agar tidak memakan route admin
router.get('/treatments/:id', async (req, res) => {
    try {
        const treatment = await Treatment.findById(req.params.id);
        if (!treatment) {
            return res.status(404).json({ message: 'Treatment not found' });
        }
        res.status(200).json({
            success: true,
            data: { ...treatment._doc, id: treatment._id }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});