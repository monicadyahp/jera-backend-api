// backend/routes/newsletter.js
import express from 'express';
import Newsletter from '../models/Newsletter.js';
import { protect, adminOnly } from './middleware.js';
import nodemailer from 'nodemailer'; // Pastikan sudah: npm install nodemailer

export const router = express.Router();

// 1. PUBLIC: Subscribe Email
router.post('/newsletter/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email wajib diisi' });

        // Cek apakah email sudah ada
        const exists = await Newsletter.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: 'Email ini sudah terdaftar.' });
        }

        await Newsletter.create({ email });
        res.status(201).json({ success: true, message: 'Berhasil berlangganan!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// 2. ADMIN: Get All Subscribers
router.get('/admin/newsletter', protect, adminOnly, async (req, res) => {
    try {
        const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
        res.json({ success: true, data: subscribers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data' });
    }
});

// 3. ADMIN: Delete Subscriber
router.delete('/admin/newsletter/:id', protect, adminOnly, async (req, res) => {
    try {
        await Newsletter.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Subscriber dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus' });
    }
});

// 4. ADMIN: Send Broadcast Email (Fitur Template)
router.post('/admin/newsletter/send', protect, adminOnly, async (req, res) => {
    try {
        const { subject, message } = req.body; // Admin mengirim subject & pesan (template)
        
        // Ambil semua email
        const subscribers = await Newsletter.find();
        const emails = subscribers.map(sub => sub.email);

        if (emails.length === 0) {
            return res.status(400).json({ success: false, message: 'Belum ada subscriber.' });
        }

        // --- KONFIGURASI NODEMAILER (Gunakan Email Gmail/SMTP Kamu) ---
        // Tips: Untuk Gmail, gunakan "App Password" bukan password login biasa
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER, // Simpan di .env: emailkamu@gmail.com
                pass: process.env.EMAIL_PASS  // Simpan di .env: password app gmail
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: emails, // Mengirim ke semua subscriber
            subject: subject,
            text: message, // Plain text
            // html: `<p>${message}</p>` // Jika ingin format HTML
        };

        // Kirim Email
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: `Email berhasil dikirim ke ${emails.length} subscriber!` });

    } catch (error) {
        console.error("Email Error:", error);
        // Tetap return success false, tapi jangan crash server
        res.status(500).json({ success: false, message: 'Gagal mengirim email. Pastikan konfigurasi SMTP benar.' });
    }
});