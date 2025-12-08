// backend/models/Faq.js
import mongoose from 'mongoose';

const faqSchema = mongoose.Schema({
    category: { type: String, required: true }, // Contoh: "The Aesthetics Skin"
    slug: { type: String, required: true },     // Contoh: "aesthetics-skin" (untuk ID scroll)
    order: { type: Number, default: 0 },        // Untuk urutan tampilan section
    items: [
        {
            question: { type: String, required: true },
            answer: { type: String, required: true }
        }
    ]
}, {
    timestamps: true,
});

const Faq = mongoose.model('Faq', faqSchema);
export default Faq;