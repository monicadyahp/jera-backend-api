// backend/routes/cart.js
import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
// --- PERBAIKAN DI SINI: Tambahkan adminOnly ---
import { protect, adminOnly } from './middleware.js';

export const router = express.Router();

// 1. GET CART (Kirim info stok)
router.get('/cart', protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart) {
            return res.status(200).json({ success: true, data: [] });
        }

        cart.items = cart.items.filter(item => item.product !== null);
        
        const formattedItems = cart.items.map(item => ({
            id: item.product._id, 
            image: item.product.image,
            brand: item.product.brand || 'The Aesthetics Skin',
            name: item.product.name,
            variant: item.product.size || '50 ML', 
            price: item.product.price,
            quantity: item.quantity,
            promoText: '', 
            stock: item.product.countInStock 
        }));

        res.status(200).json({ success: true, data: formattedItems });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil keranjang.' });
    }
});

// 2. ADD TO CART
router.post('/cart', protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            const newQty = cart.items[itemIndex].quantity + quantity;
            if (newQty > product.countInStock) {
                return res.status(400).json({ success: false, message: `Stok tidak cukup. Sisa: ${product.countInStock}` });
            }
            cart.items[itemIndex].quantity = newQty;
        } else {
            if (quantity > product.countInStock) {
                return res.status(400).json({ success: false, message: `Stok tidak cukup. Sisa: ${product.countInStock}` });
            }
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        res.status(200).json({ success: true, message: 'Produk ditambahkan.', cartCount: cart.items.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal update keranjang.' });
    }
});

// 3. UPDATE QUANTITY
router.put('/cart/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const userId = req.user._id;

        const product = await Product.findById(productId);
        const cart = await Cart.findOne({ user: userId });

        if (!product || !cart) return res.status(404).json({ message: 'Data tidak ditemukan' });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            if (quantity > product.countInStock) {
                return res.status(400).json({ success: false, message: `Maksimal stok: ${product.countInStock}` });
            }
            if (quantity > 0) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();
            res.status(200).json({ success: true, message: 'Keranjang diperbarui.' });
        } else {
            res.status(404).json({ message: 'Produk tidak ada di keranjang.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal update qty.' });
    }
});

// 4. REMOVE ITEM
router.delete('/cart/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });
        if (cart) {
            cart.items = cart.items.filter(item => item.product.toString() !== productId);
            await cart.save();
        }

        res.status(200).json({ success: true, message: 'Item dihapus.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal hapus item.' });
    }
});

// 5. GET ALL CARTS (Admin Only) - UNTUK MONITORING
router.get('/admin/carts', protect, adminOnly, async (req, res) => {
    try {
        const carts = await Cart.find({})
            .populate('user', 'name email')
            .populate('items.product', 'name price image');
        
        // Filter cart yang tidak kosong saja agar rapi
        const activeCarts = carts.filter(c => c.items.length > 0);
        
        res.status(200).json({ success: true, data: activeCarts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data cart.' });
    }
});

export default router;