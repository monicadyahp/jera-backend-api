import mongoose from 'mongoose';

const contactSchema = mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    hours: { type: String, required: true },
    isNewOutlet: { type: Boolean, default: false }, // Saya ganti jadi isNewOutlet agar tidak bentrok keyword 'isNew'
}, {
    timestamps: true,
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;