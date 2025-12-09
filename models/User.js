// backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // --- UPDATE: Tambahkan Company/Status ---
    company: { type: String, default: '' }, // Contoh: "Mahasiswa", "Freelancer"
    
    gender: { type: String, enum: ['Laki-Laki', 'Perempuan', 'Lainnya'], default: 'Laki-Laki' },
    birthDate: { type: Date, default: null },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    
    age: { type: Number, default: 0 }, 
    skinType: { type: String, default: 'Tidak Tahu' },
    avatar: { type: String, default: null },
    role: { type: String, default: 'user' },
}, {
    timestamps: true,
});

// ... (Middleware pre-save & method matchPassword tetap sama) ...
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;