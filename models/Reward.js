// backend/models/Reward.js
import mongoose from 'mongoose';

const rewardSchema = mongoose.Schema({
    // Type menentukan posisi data: 'how_it_works', 'ways_to_earn', atau 'reward_list'
    type: { 
        type: String, 
        required: true, 
        enum: ['how_it_works', 'ways_to_earn', 'reward_list'] 
    }, 
    title: { type: String }, // Judul (dipakai di how_it_works & ways_to_earn)
    desc: { type: String },  // Deskripsi
    sub: { type: String },   // Sub-deskripsi (khusus ways_to_earn)
    points: { type: String },// Poin (khusus ways_to_earn)
    icon: { type: String },  // Icon class (bx-...)
    text: { type: String },  // Khusus untuk reward_list yang isinya cuma teks
    order: { type: Number, default: 0 }, // Untuk urutan tampilan
}, {
    timestamps: true,
});

const Reward = mongoose.model('Reward', rewardSchema);
export default Reward;