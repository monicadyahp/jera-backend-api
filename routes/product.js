// backend/routes/product.js
import express from 'express';
import Product from '../models/Product.js';
import User from '../models/User.js';
import History from '../models/History.js';
import Order from '../models/Order.js'; // <--- 1. TAMBAHAN IMPORT
import { protect, adminOnly } from './middleware.js';

export const router = express.Router();

// ==========================================
// A. ROUTES PUBLIC
// ==========================================

// 1. GET ALL PRODUCTS
router.get('/products', async (req, res) => {
    try {
        const { category, skinType, minPrice, maxPrice } = req.query;
        let filter = {};

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (skinType && skinType !== 'all') {
            filter.suitableFor = { $regex: skinType, $options: 'i' };
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(filter).lean();

        const formattedProducts = products.map(p => ({
            ...p,
            id: p._id,
            image: p.image,
            rawPrice: p.price 
        }));

        res.status(200).json({ success: true, data: formattedProducts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. GET SINGLE PRODUCT
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
        }

        const formattedProduct = {
            ...product,
            id: product._id,
            image: product.image,
            images: [product.image, product.image], 
            details: {
                benefits: product.benefits || [],
                usage: product.usage || 'Lihat kemasan.',
                ingredients: 'Lihat kemasan.'
            },
            rating: 5,
            reviews: 0,
            sold: 0
        };

        res.status(200).json({ success: true, data: formattedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil detail produk.' });
    }
});

// ==========================================
// B. ROUTES ADMIN
// ==========================================

// GET ALL PRODUCTS (Admin)
router.get('/admin/products', protect, adminOnly, async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 }); // Urutkan terbaru
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data.' });
    }
});

// CREATE PRODUCT (Admin)
router.post('/admin/products', protect, adminOnly, async (req, res) => {
    try {
        console.log("📥 [CREATE] Menerima Data:", req.body); // LOG 1

        const { 
            name, brand, category, description, 
            price, countInStock, image, 
            suitableFor, benefits, usage, link 
        } = req.body;

        // 1. Validasi Input Wajib
        if (!name || !brand || !category || !description) {
            console.error("❌ Validasi Gagal: Field wajib kosong.");
            return res.status(400).json({ success: false, message: 'Mohon lengkapi nama, brand, kategori, dan deskripsi.' });
        }

        // 2. Konversi Tipe Data (Safety)
        const priceNum = Number(price);
        const stockNum = Number(countInStock);

        if (isNaN(priceNum) || isNaN(stockNum)) {
            console.error("❌ Validasi Gagal: Harga atau Stok bukan angka.");
            return res.status(400).json({ success: false, message: 'Harga dan Stok harus berupa angka.' });
        }

        // 3. Buat Object Product
        const newProduct = new Product({
            name,
            brand,
            category,
            description,
            price: priceNum,
            countInStock: stockNum,
            // Pastikan array valid
            suitableFor: Array.isArray(suitableFor) ? suitableFor : [],
            benefits: Array.isArray(benefits) ? benefits : [],
            usage: usage || '',
            image: image || '',
            link: link || ''
        });

        // 4. Simpan ke Database
        const createdProduct = await newProduct.save();
        
        console.log("✅ Produk Berhasil Disimpan:", createdProduct._id);
        res.status(201).json({ success: true, data: createdProduct });

    } catch (error) {
        console.error("❌ SERVER ERROR saat Create Product:", error); // LOG ERROR DETAIL
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Terjadi kesalahan server saat menyimpan produk.' 
        });
    }
});

// UPDATE PRODUCT (Admin)
router.put('/admin/products/:id', protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
        }

        // Update fields
        product.name = req.body.name || product.name;
        product.brand = req.body.brand || product.brand;
        product.category = req.body.category || product.category;
        product.description = req.body.description || product.description;
        product.image = req.body.image || product.image;
        product.usage = req.body.usage || product.usage;
        product.link = req.body.link || product.link;

        if (req.body.price !== undefined) product.price = Number(req.body.price);
        if (req.body.countInStock !== undefined) product.countInStock = Number(req.body.countInStock);

        if (req.body.suitableFor) product.suitableFor = req.body.suitableFor;
        if (req.body.benefits) product.benefits = req.body.benefits;

        const updatedProduct = await product.save();
        res.json({ success: true, data: updatedProduct });

    } catch (error) {
        console.error("❌ SERVER ERROR saat Update Product:", error);
        res.status(500).json({ success: false, message: 'Gagal update produk.' });
    }
});

// DELETE PRODUCT (Admin)
router.delete('/admin/products/:id', protect, adminOnly, async (req, res) => {
    try {
        await Product.deleteOne({ _id: req.params.id });
        res.status(200).json({ success: true, message: 'Produk dihapus.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal hapus produk.' });
    }
});

// ==========================================
// GET STATS (Admin) - UPDATE LENGKAP (Charts & Tables)
// ==========================================
router.get('/admin/stats', protect, adminOnly, async (req, res) => {
    try {
        // 1. Data COUNTS (Kartu Atas)
        const totalUsers = await User.countDocuments();
        const totalScans = await History.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        // 2. Data TOTAL REVENUE
        const paidOrders = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        const totalRevenue = paidOrders.length > 0 ? paidOrders[0].total : 0;

        // 3. Data RECENT ORDERS (Tabel Preview - Ambil 5 Terakhir)
        const recentOrders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email');

        // 4. Data RECENT USERS (Tabel Preview - Ambil 5 Terakhir)
        const recentUsers = await User.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email createdAt');

        res.status(200).json({ 
            success: true, 
            data: { 
                totalUsers, 
                totalScans, 
                totalProducts, 
                totalOrders,
                totalRevenue,
                recentOrders, // <--- Data Baru
                recentUsers   // <--- Data Baru
            } 
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ success: false, message: 'Gagal ambil statistik.' });
    }
});