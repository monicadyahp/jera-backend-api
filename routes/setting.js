import express from 'express';
import SiteSetting from '../models/SiteSetting.js';
import { protect, adminOnly } from './middleware.js';

export const router = express.Router();

// 1. GET SETTINGS (Public - Bisa diakses siapa saja untuk footer/header)
router.get('/settings', async (req, res) => {
    try {
        // Ambil setting pertama, jika tidak ada buat default
        let settings = await SiteSetting.findOne();
        if (!settings) {
            settings = await SiteSetting.create({});
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal ambil setting.' });
    }
});

// 2. UPDATE SETTINGS (Admin Only)
router.put('/admin/settings', protect, adminOnly, async (req, res) => {
    try {
        let settings = await SiteSetting.findOne();
        if (!settings) {
            settings = new SiteSetting();
        }

        // Update fields
        settings.siteName = req.body.siteName || settings.siteName;
        settings.whatsappMain = req.body.whatsappMain || settings.whatsappMain;
        settings.emailSupport = req.body.emailSupport || settings.emailSupport;
        settings.socialInstagram = req.body.socialInstagram || settings.socialInstagram;
        settings.socialTiktok = req.body.socialTiktok || settings.socialTiktok;
        settings.socialFacebook = req.body.socialFacebook || settings.socialFacebook;
        settings.announcementText = req.body.announcementText || settings.announcementText;
        settings.showAnnouncement = req.body.showAnnouncement !== undefined ? req.body.showAnnouncement : settings.showAnnouncement;

        const updatedSettings = await settings.save();
        res.status(200).json({ success: true, data: updatedSettings });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal update setting.' });
    }
});