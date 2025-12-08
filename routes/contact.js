// backend/routes/contact.js
import express from 'express';
import Contact from '../models/Contact.js';
import { protect, adminOnly } from './middleware.js';

export const router = express.Router();

// 1. GET ALL CONTACTS (Public)
router.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find({}).sort({ isNewOutlet: -1 }); // Outlet baru di atas
        const formattedContacts = contacts.map(c => ({
            ...c._doc,
            id: c._id,
        }));
        res.status(200).json({ success: true, data: formattedContacts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data outlet.' });
    }
});

// 2. CREATE CONTACT (Admin)
router.post('/admin/contacts', protect, adminOnly, async (req, res) => {
    try {
        const { name, address, phone, hours, isNew } = req.body;
        
        if (!name || !address || !phone) {
            return res.status(400).json({ success: false, message: 'Nama, Alamat, dan Telepon wajib diisi.' });
        }

        const newContact = await Contact.create({
            name,
            address,
            phone,
            hours: hours || 'Senin–Minggu 09.00 – 17.00',
            isNewOutlet: isNew || false
        });

        res.status(201).json({ success: true, data: newContact });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menambah outlet.' });
    }
});

// 3. UPDATE CONTACT (Admin) - TAMBAHAN BARU
router.put('/admin/contacts/:id', protect, adminOnly, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (contact) {
            contact.name = req.body.name || contact.name;
            contact.address = req.body.address || contact.address;
            contact.phone = req.body.phone || contact.phone;
            contact.hours = req.body.hours || contact.hours;
            contact.isNewOutlet = req.body.isNew !== undefined ? req.body.isNew : contact.isNewOutlet;

            const updatedContact = await contact.save();
            res.json({ success: true, data: updatedContact });
        } else {
            res.status(404).json({ success: false, message: 'Outlet tidak ditemukan.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal update outlet.' });
    }
});

// 4. DELETE CONTACT (Admin)
router.delete('/admin/contacts/:id', protect, adminOnly, async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Outlet berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus outlet.' });
    }
});