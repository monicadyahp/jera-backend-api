import express from 'express';
import Treatment from '../models/Treatment.js';

export const router = express.Router();

// 1. GET All Treatments (Untuk Halaman List)
router.get('/treatments', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        // Fitur Search sederhana di Backend
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const treatments = await Treatment.find(query);

        // Format data agar sesuai ekspektasi frontend (jika perlu formatting khusus)
        const formattedTreatments = treatments.map(t => ({
            ...t._doc,
            id: t._id, // Convert _id ke id string
            // Format price ke string 'Rp xxx' bisa dilakukan di frontend, 
            // tapi kita kirim raw number juga tidak masalah.
        }));

        res.status(200).json(formattedTreatments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. GET Treatment Detail by ID (Untuk Halaman Detail)
router.get('/treatments/:id', async (req, res) => {
    try {
        const treatment = await Treatment.findById(req.params.id);
        if (!treatment) {
            return res.status(404).json({ message: 'Treatment not found' });
        }
        res.status(200).json({
            ...treatment._doc,
            id: treatment._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});