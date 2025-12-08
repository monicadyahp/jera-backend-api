// backend/models/Blog.js
import mongoose from 'mongoose';

const blogSchema = mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, default: 'Admin' },
    date: { type: String, default: 'Just now' }, // Bisa diganti Date type jika ingin auto
    
    // Untuk tampilan List (Card)
    imageMain: { type: String, required: true }, // Gambar utama
    description: { type: String, required: true }, // Deskripsi singkat
    
    // Untuk tampilan Detail
    header1: { type: String },
    content1: { type: String },
    imageSecond: { type: String },
    header2: { type: String },
    content2: { type: String },
    
    // Tagging
    tag: { type: String },
}, {
    timestamps: true,
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;