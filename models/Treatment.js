import mongoose from 'mongoose';

const treatmentSchema = mongoose.Schema({
    // Info Utama
    title: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'Face Treatment'
    price: { type: Number, required: true }, // Simpan angka murni (e.g., 299000)
    duration: { type: String, required: true }, // e.g., '60 minutes'
    frequency: { type: String, default: '' },   // e.g., '1-3x per month'
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    
    // Deskripsi & Konten
    description: { type: String, required: true },
    benefits: [{ type: String }], // Array of strings
    tags: [{ type: String }],     // Array of strings
    img: { type: String, required: true }, // URL Gambar

    // Detail Booking (Varian & Addons)
    variants: [{
        name: { type: String },
        sub: { type: String },
        price: { type: Number }
    }],
    addons: [{
        name: { type: String },
        sub: { type: String },
        price: { type: Number }
    }],
    
    // Lokasi & Waktu
    branches: [{ type: String }],
    timeSlots: [{ type: String }]

}, {
    timestamps: true,
});

const Treatment = mongoose.model('Treatment', treatmentSchema);
export default Treatment;