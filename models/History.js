import mongoose from 'mongoose';

const historySchema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    photo: { type: String, required: true },
    kondisi_jerawat: { type: String, required: true },
    keyakinan_model: { type: Number, required: true },
    
    rekomendasi_makanan: { type: String },
    makanan_tidak_boleh_dimakan: { type: String },
    rekomendasi_aktivitas_fisik: { type: String },
    rekomendasi_manajemen_stress: { type: String },
}, {
    timestamps: true,
});

const History = mongoose.model('History', historySchema);
export default History;