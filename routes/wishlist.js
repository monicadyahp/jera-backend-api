// backend/routes/wishlist.js
import express from 'express';
import Wishlist from '../models/Wishlist.js';
// --- PERBAIKAN DI SINI: Tambahkan adminOnly ---
import { protect, adminOnly } from './middleware.js'; 

export const router = express.Router();

// 1. GET USER WISHLIST
router.get('/wishlist', protect, async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

        if (!wishlist) {
            return res.status(200).json({ success: true, data: [] });
        }

        const formattedProducts = wishlist.products
            .filter(p => p !== null) 
            .map(p => ({
                ...p._doc,
                id: p._id,
                price: p.price,
                oldPrice: p.price ? p.price * 1.2 : 0,
                priceFormatted: p.price ? p.price.toLocaleString('id-ID') : '-'
            }));

        if (wishlist.products.length !== formattedProducts.length) {
            wishlist.products = formattedProducts.map(p => p.id);
            await wishlist.save();
        }

        res.status(200).json({ success: true, data: formattedProducts });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ success: false, message: 'Gagal mengambil wishlist.' });
    }
});

// 2. TOGGLE WISHLIST (Add/Remove One)
router.post('/wishlist/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, products: [] });
        }

        const productIndex = wishlist.products.findIndex(p => p.toString() === productId);

        let message = '';
        if (productIndex > -1) {
            wishlist.products.splice(productIndex, 1);
            message = 'Produk dihapus dari wishlist.';
        } else {
            wishlist.products.push(productId);
            message = 'Produk ditambahkan ke wishlist.';
        }

        await wishlist.save();

        res.status(200).json({ success: true, message, count: wishlist.products.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal update wishlist.' });
    }
});

// 3. CLEAR ALL WISHLIST
router.delete('/wishlist', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        
        const wishlist = await Wishlist.findOne({ user: userId });

        if (wishlist) {
            wishlist.products = []; 
            await wishlist.save();
        }

        res.status(200).json({ success: true, message: 'Semua wishlist berhasil dihapus.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal menghapus wishlist.' });
    }
});

// 4. GET ALL WISHLISTS (Admin Only) - UNTUK MONITORING
router.get('/admin/wishlists', protect, adminOnly, async (req, res) => {
    try {
        const wishlists = await Wishlist.find({})
            .populate('user', 'name email')
            .populate('products', 'name price image');

        // Filter wishlist yang tidak kosong
        const activeWishlists = wishlists.filter(w => w.products.length > 0);

        res.status(200).json({ success: true, data: activeWishlists });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data wishlist.' });
    }
});

export default router;