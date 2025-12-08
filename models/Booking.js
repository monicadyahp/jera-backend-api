import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },
    
    date: { type: String, required: true }, 
    time: { type: String, required: true }, 
    
    treatment: { type: String, required: true }, 
    branch: { type: String, required: true }, 
    
    problem: { type: String },
    
    // --- PERBAIKAN DI SINI: Tambahkan 'completed' ke dalam enum ---
    status: { 
        type: String, 
        default: 'pending', 
        enum: ['pending', 'confirmed', 'cancelled', 'completed'] // <--- TAMBAHKAN 'completed'
    }
}, {
    timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;