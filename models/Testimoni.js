import mongoose from 'mongoose';

const testimoniSchema = mongoose.Schema({
    name: { type: String, required: true },
    company: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, required: true }, // URL Foto profile
    rating: { type: Number, default: 5, min: 1, max: 5 },
}, {
    timestamps: true,
});

const Testimoni = mongoose.model('Testimoni', testimoniSchema);
export default Testimoni;