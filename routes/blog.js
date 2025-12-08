// backend/routes/blog.js
import express from 'express';
import Blog from '../models/Blog.js';
import { protect, adminOnly } from './middleware.js';

export const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// 1. GET ALL BLOGS
router.get('/blogs', async (req, res) => {
    try {
        const { limit, category, excludeId } = req.query;
        let query = {};

        if (category) query.category = category;
        if (excludeId) query._id = { $ne: excludeId };

        let blogsQuery = Blog.find(query).sort({ createdAt: -1 });

        if (limit) {
            blogsQuery = blogsQuery.limit(parseInt(limit));
        }

        const blogs = await blogsQuery;
        const formattedBlogs = blogs.map(blog => ({
            ...blog._doc,
            id: blog._id,
        }));

        res.status(200).json({ success: true, data: formattedBlogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. GET SINGLE BLOG
router.get('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog tidak ditemukan' });
        }
        res.status(200).json({ success: true, data: { ...blog._doc, id: blog._id } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Invalid Blog ID' });
    }
});

// ==========================================
// ADMIN ROUTES (PROTECTED)
// ==========================================

// 3. CREATE BLOG
router.post('/admin/blogs', protect, adminOnly, async (req, res) => {
    try {
        const { title, category, imageMain, description, header1, content1, header2, content2, tag } = req.body;

        if (!title || !category || !imageMain || !description) {
            return res.status(400).json({ success: false, message: 'Judul, Kategori, Gambar Utama, dan Deskripsi wajib diisi.' });
        }

        const newBlog = await Blog.create({
            title,
            category,
            author: 'Admin', // Default author
            imageMain,
            description,
            header1: header1 || '',
            content1: content1 || '',
            imageSecond: req.body.imageSecond || '',
            header2: header2 || '',
            content2: content2 || '',
            tag: tag || category
        });

        res.status(201).json({ success: true, data: newBlog });
    } catch (error) {
        console.error("Create Blog Error:", error);
        res.status(500).json({ success: false, message: 'Gagal membuat blog.' });
    }
});

// 4. UPDATE BLOG
router.put('/admin/blogs/:id', protect, adminOnly, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            blog.title = req.body.title || blog.title;
            blog.category = req.body.category || blog.category;
            blog.imageMain = req.body.imageMain || blog.imageMain;
            blog.description = req.body.description || blog.description;
            
            // Optional Fields
            blog.header1 = req.body.header1 || blog.header1;
            blog.content1 = req.body.content1 || blog.content1;
            blog.imageSecond = req.body.imageSecond || blog.imageSecond;
            blog.header2 = req.body.header2 || blog.header2;
            blog.content2 = req.body.content2 || blog.content2;
            blog.tag = req.body.tag || blog.tag;

            const updatedBlog = await blog.save();
            res.json({ success: true, data: updatedBlog });
        } else {
            res.status(404).json({ success: false, message: 'Blog tidak ditemukan.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal update blog.' });
    }
});

// 5. DELETE BLOG
router.delete('/admin/blogs/:id', protect, adminOnly, async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Blog berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal hapus blog.' });
    }
});