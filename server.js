// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Pastikan sudah npm install cors
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose'; 

// Import Koneksi & Routes
import connectDB from './db.js';
import apiRouter from './routes/api.js'; 

dotenv.config();
connectDB(); 

const app = express();
const PORT = process.env.PORT || 3000; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// PERBAIKAN CORS (VERSI FINAL - ALLOW ALL)
// ==========================================
// Kita gunakan konfigurasi paling longgar agar Frontend Vercel pasti bisa masuk.
// Hapus konfigurasi lama yang pakai array origin [...].
app.use(cors()); 

// 2. Tambahan Header Manual (Jaga-jaga kalau cors() gagal)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Folder uploads harus bisa diakses publik (Hanya untuk local dev, di Vercel folder ini read-only)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logger Request (Biar kelihatan di terminal logs Vercel)
app.use((req, res, next) => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    next();
});

// Route Cek Status Server
app.get('/', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.send(`API is running... Database status: ${dbStatus}`);
});

// --- ROUTING UTAMA ---
app.use('/api', apiRouter); 

// --- EXPORT UNTUK VERCEL ---
export default app;