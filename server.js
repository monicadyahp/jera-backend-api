// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose'; 

// Import Koneksi
import connectDB from './db.js';

// --- IMPORT ROUTES ---
import apiRouter from './routes/api.js'; 
import scanRoutes from './routes/scan.js'; // <--- (1) INI YANG KETINGGALAN KEMARIN

dotenv.config();
connectDB(); 

const app = express();
// Kita tetap pakai PORT 3000 sesuai keinginanmu
const PORT = process.env.PORT || 3000; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// SETUP CORS (ALLOW ALL)
// ==========================================
app.use(cors()); 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logger Request (Supaya kamu bisa lihat di terminal kalau ada request masuk)
app.use((req, res, next) => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    next();
});

// Route Cek Status Server
app.get('/', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.send(`API is running on Port ${PORT}... Database: ${dbStatus}`);
});

// --- ROUTING UTAMA ---
app.use('/api', apiRouter); 

// --- DAFTARKAN ROUTE SCAN ---
// Route di scan.js berawalan '/scan/recommendations'
// Kita tempel di '/api', jadinya: http://localhost:3000/api/scan/recommendations
app.use('/api', scanRoutes); // <--- (2) INI YANG MENYAMBUNGKAN KABELNYA

// Listen Server
app.listen(PORT, () => {
    console.log(`🚀 Server Backend berjalan di port ${PORT}`);
});

export default app;