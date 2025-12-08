import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
// PERBAIKAN DI SINI: Import 'adminOnly' sesuai nama di middleware.js
import { protect, adminOnly } from './middleware.js'; 

export const router = express.Router();

// 1. CREATE NEW ORDER (CHECKOUT)
router.post('/orders', protect, async (req, res) => {
    try {
        const { shippingAddress, paymentMethod, firstName, lastName, apartment, city, province, postalCode, phone } = req.body;

        // A. Ambil Keranjang User dari Database
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Keranjang belanja kosong.' });
        }

        // B. Konversi Item Cart ke Item Order & Hitung Harga
        let itemsPrice = 0;
        const orderItems = [];

        for (const item of cart.items) {
            if (item.product) { 
                itemsPrice += item.product.price * item.quantity;
                orderItems.push({
                    product: item.product._id,
                    name: item.product.name,
                    image: item.product.image,
                    price: item.product.price,
                    qty: item.quantity,
                    variant: item.product.size || 'Regular'
                });
            }
        }

        // C. Hitung Tax & Shipping
        const taxPrice = itemsPrice * 0.11; 
        const shippingPrice = itemsPrice > 500000 ? 0 : 20000; 
        const totalPrice = itemsPrice + taxPrice + shippingPrice;

        // Gabungkan detail alamat jika perlu
        const fullAddressData = {
            address: shippingAddress?.address || req.body.address, // Handle jika format beda
            city,
            postalCode,
            phone,
            recipientName: `${firstName} ${lastName}`
        };

        // D. Simpan Order ke Database
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress: fullAddressData, // Simpan objek alamat
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid: true, // Asumsi langsung paid
            paidAt: Date.now(),
            status: 'Paid' // Status awal
        });

        const createdOrder = await order.save();

        // E. KOSONGKAN KERANJANG SETELAH ORDER DIBUAT
        cart.items = [];
        await cart.save();

        res.status(201).json({ success: true, data: createdOrder });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal memproses pesanan.' });
    }
});

// 2. GET MY ORDERS (Riwayat Pesanan User Login)
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data pesanan.' });
    }
});

// 3. GET ALL ORDERS (KHUSUS ADMIN)
// PERBAIKAN DI SINI: Menggunakan 'adminOnly' bukan 'admin'
router.get('/orders', protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email');
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil semua pesanan.' });
    }
});

// 4. UPDATE STATUS ORDER (KHUSUS ADMIN)
// PERBAIKAN DI SINI: Menggunakan 'adminOnly' bukan 'admin'
router.put('/orders/:id/deliver', protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            order.status = 'Selesai'; 
            
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Gagal update order' });
    }
});

// 5. GET ORDER BY ID (Admin) - INI WAJIB ADA
router.get('/admin/orders/:id', protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (order) {
            res.status(200).json({ success: true, data: order });
        } else {
            res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil detail order.' });
    }
});