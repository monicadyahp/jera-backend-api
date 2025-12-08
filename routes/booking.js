// backend/routes/booking.js
import express from 'express';
import Booking from '../models/Booking.js';
import { protect, adminOnly } from './middleware.js';

export const router = express.Router();

// 1. CREATE BOOKING (Public - User Booking)
router.post('/booking', async (req, res) => {
    try {
        const { firstName, lastName, date, time, treatment, branch, email, whatsapp, problem } = req.body;

        // Validasi sederhana
        if (!firstName || !date || !time || !treatment || !whatsapp) {
            return res.status(400).json({ success: false, message: 'Data wajib diisi tidak lengkap.' });
        }

        const newBooking = await Booking.create({
            firstName,
            lastName,
            date,
            time,
            treatment,
            branch,
            email,
            whatsapp,
            problem
        });

        res.status(201).json({ success: true, message: 'Booking berhasil dibuat!', data: newBooking });
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: 'Gagal membuat booking.' });
    }
});

// 2. GET ALL BOOKINGS (Admin Only)
router.get('/admin/bookings', protect, adminOnly, async (req, res) => {
    try {
        // Urutkan berdasarkan tanggal booking terdekat, lalu waktu
        const bookings = await Booking.find({}).sort({ date: -1, time: 1 });
        
        const formatted = bookings.map(b => ({
            ...b._doc,
            id: b._id
        }));

        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data booking.' });
    }
});

// 3. UPDATE STATUS BOOKING (Admin Only) - TAMBAHAN BARU
// Endpoint ini untuk mengubah status: pending -> confirmed / cancelled / completed
router.put('/admin/bookings/:id', protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.body; // status: 'confirmed', 'cancelled', 'completed'
        
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking tidak ditemukan.' });
        }

        booking.status = status;
        const updatedBooking = await booking.save();

        res.status(200).json({ success: true, data: updatedBooking, message: `Status berhasil diubah menjadi ${status}` });

    } catch (error) {
        console.error("Update Booking Error:", error);
        res.status(500).json({ success: false, message: 'Gagal update status booking.' });
    }
});

// 4. DELETE BOOKING (Admin Only) - OPSIONAL (Untuk bersih-bersih)
router.delete('/admin/bookings/:id', protect, adminOnly, async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Data booking dihapus.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal hapus booking.' });
    }
});