// backend/models/Tnc.js
import mongoose from 'mongoose';

const tncSchema = mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['paragraph', 'list'], default: 'paragraph' }, // Jenis konten
    content: [{ type: String, required: true }], // Array string agar bisa menampung banyak poin
    order: { type: Number, default: 0 } // Untuk mengatur urutan tampilan
}, {
    timestamps: true,
});

const Tnc = mongoose.model('Tnc', tncSchema);
export default Tnc;