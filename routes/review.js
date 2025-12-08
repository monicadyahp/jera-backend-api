// backend/routes/review.js
import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from './middleware.js';

export const router = express.Router();

// 1. CREATE REVIEW (User Only) - Sudah ada sebelumnya
router.post('/reviews/:id', protect, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            // Cek apakah user sudah review
            const alreadyReviewed = await Review.findOne({
                user: req.user._id,
                product: product._id // Pastikan Model Review punya field 'product' reference
            });

            // Note: Di Model Review awal Anda tidak ada field 'product', 
            // tapi biasanya review nempel ke produk. 
            // Jika schema Review Anda terpisah, kita asumsikan strukturnya.
            // SEMENTARA KITA FOKUS KE ADMIN DELETE SAJA.
            
            const review = await Review.create({
                user: req.user._id,
                rating: Number(rating),
                comment,
            });
            
            // Logic update rating product bisa disini...

            res.status(201).json({ message: 'Review ditambahkan' });
        } else {
            res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Gagal menambah review' });
    }
});

// 2. GET ALL REVIEWS (Admin Only) - ENDPOINT BARU
router.get('/admin/reviews', protect, adminOnly, async (req, res) => {
    try {
        // Ambil semua review, populate data User (nama)
        // Kita asumsikan review ini terkait produk, tapi di schema awal Anda 
        // field 'product' tidak tertulis eksplisit di 'backend > models > Review.js' yang Anda kirim.
        // Tapi biasanya Review butuh relasi ke Product.
        // Jika belum ada relasi Product di schema Review, kita tampilkan User dan Comment saja dulu.
        
        const reviews = await Review.find({})
            .populate('user', 'name email avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data review.' });
    }
});

// 3. DELETE REVIEW (Admin Only) - ENDPOINT BARU
router.delete('/admin/reviews/:id', protect, adminOnly, async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Review berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus review.' });
    }
});