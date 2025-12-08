import mongoose from 'mongoose';
import dotenv from 'dotenv';

// PERBAIKAN:
// Karena file .env ada di folder yang sama dengan db.js (di folder backend),
// kita cukup panggil config() tanpa path '../'.
// Kecuali kamu menjalankan terminal dari luar folder backend.
dotenv.config(); 

const connectDB = async () => {
    try {
        // PERBAIKAN: Pastikan nama variabel sama dengan di .env (MONGO_URI)
        // Debugging: Kita console log dulu untuk memastikan URI terbaca (jangan log password di production)
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI tidak ditemukan di file .env!");
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;