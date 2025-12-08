// backend/routes/reward.js
import express from 'express';
import Reward from '../models/Reward.js';
import { protect, adminOnly } from './middleware.js';

export const router = express.Router();

// 1. GET ALL REWARDS (Public - Grouped)
// Endpoint ini dipakai oleh Halaman Reward di website utama
router.get('/rewards', async (req, res) => {
    try {
        const rewards = await Reward.find({}).sort({ order: 1 });

        // Format khusus untuk frontend public (dikelompokkan)
        const howItWorks = rewards.filter(r => r.type === 'how_it_works')
            .map(r => ({ id: r._id, title: r.title, desc: r.desc, icon: r.icon }));

        const waysToEarn = rewards.filter(r => r.type === 'ways_to_earn')
            .map(r => ({ id: r._id, points: r.points, desc: r.desc, sub: r.sub, icon: r.icon }));

        const rewardsList = rewards.filter(r => r.type === 'reward_list')
            .map(r => ({ id: r._id, text: r.text }));

        res.status(200).json({
            success: true,
            data: { howItWorks, waysToEarn, rewardsList }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data reward.' });
    }
});

// 2. GET ALL REWARDS LIST (Admin - Flat List)
// Endpoint baru khusus admin agar mudah ditampilkan di tabel
router.get('/admin/rewards', protect, adminOnly, async (req, res) => {
    try {
        const rewards = await Reward.find({}).sort({ type: 1, order: 1 });
        res.status(200).json({ success: true, data: rewards });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal ambil data admin.' });
    }
});

// 3. GET SINGLE REWARD (Admin)
router.get('/admin/rewards/:id', protect, adminOnly, async (req, res) => {
    try {
        const reward = await Reward.findById(req.params.id);
        if(!reward) return res.status(404).json({message: 'Not found'});
        res.status(200).json({ success: true, data: reward });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error server.' });
    }
});

// 4. CREATE REWARD (Admin)
router.post('/admin/rewards', protect, adminOnly, async (req, res) => {
    try {
        const newReward = await Reward.create(req.body);
        res.status(201).json({ success: true, data: newReward });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menambah reward.' });
    }
});

// 5. UPDATE REWARD (Admin)
router.put('/admin/rewards/:id', protect, adminOnly, async (req, res) => {
    try {
        const updatedReward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: updatedReward });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal update reward.' });
    }
});

// 6. DELETE REWARD (Admin)
router.delete('/admin/rewards/:id', protect, adminOnly, async (req, res) => {
    try {
        await Reward.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Reward berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus reward.' });
    }
});