// backend/routes/returnPolicy.js
import express from 'express';
import ReturnPolicy from '../models/ReturnPolicy.js';
import { protect, adminOnly } from './middleware.js';

export const router = express.Router();

// 1. GET Return Policy (Public)
// Kita gunakan findOne() karena biasanya hanya ada 1 dokumen kebijakan di website
router.get('/return-policy', async (req, res) => {
    try {
        const policy = await ReturnPolicy.findOne();
        
        if (!policy) {
             return res.status(404).json({ success: false, message: 'Data kebijakan belum ada.' });
        }

        // Format data agar sesuai kebutuhan frontend (hapus _id di sub-item jika tidak perlu, atau biarkan)
        const formattedData = {
            ...policy._doc,
            id: policy._id
        };

        res.status(200).json({ success: true, data: formattedData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data.' });
    }
});

// 2. CREATE / UPDATE Return Policy (Admin Only)
// Endpoint ini cukup pintar: jika data belum ada dia Create, jika sudah ada dia Update.
router.put('/admin/return-policy', protect, adminOnly, async (req, res) => {
    try {
        const { title, introTitle, introDesc, sections, footerNote } = req.body;
        
        // Cek apakah sudah ada data?
        let policy = await ReturnPolicy.findOne();

        if (policy) {
            // UPDATE
            policy.title = title;
            policy.introTitle = introTitle;
            policy.introDesc = introDesc;
            policy.sections = sections;
            policy.footerNote = footerNote;
            await policy.save();
            return res.status(200).json({ success: true, data: policy, message: 'Kebijakan berhasil diperbarui.' });
        } else {
            // CREATE BARU
            const newPolicy = await ReturnPolicy.create({
                title, introTitle, introDesc, sections, footerNote
            });
            return res.status(201).json({ success: true, data: newPolicy, message: 'Kebijakan berhasil dibuat.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal menyimpan data.' });
    }
});