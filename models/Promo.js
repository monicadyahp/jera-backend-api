// backend/models/Promo.js
import mongoose from 'mongoose';

const promoSchema = mongoose.Schema({
    title: { type: String, required: true },     // cth: "GIFT VOUCHER"
    treatment: { type: String, required: true }, // cth: "LIP LASER"
    value: { type: String, required: true },     // cth: "Rp 300,000"
    image: { type: String, required: true },     // URL Gambar
    bg_color: { type: String, default: '#E0D4EB' }, // Hex Color
}, {
    timestamps: true,
});

const Promo = mongoose.model('Promo', promoSchema);
export default Promo;