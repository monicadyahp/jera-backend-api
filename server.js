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
// PERBAIKAN CORS (SOLUSI MASALAH ANDA)
// ==========================================
// Menggunakan origin: true membiarkan browser dan server
// melakukan "handshake" otorisasi secara otomatis untuk domain apapun.
app.use(cors({
    origin: ["http://localhost:5173", "https://jera-remake-app.vercel.app"], 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Folder uploads harus bisa diakses publik untuk menampilkan gambar hasil scan
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logger Request (Biar kelihatan di terminal kalau ada yang akses)
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

// app.listen(PORT, () => {
//      console.log(`Server running on port ${PORT}`);
// });

// BENAR (Pakai ini):
export default app;