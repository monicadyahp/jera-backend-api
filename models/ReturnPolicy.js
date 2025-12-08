// backend/models/ReturnPolicy.js
import mongoose from 'mongoose';

const returnPolicySchema = mongoose.Schema({
    title: { type: String, required: true },
    introTitle: { type: String, required: true },
    introDesc: { type: String, required: true },
    // Array of Objects untuk bagian poin-poin
    sections: [
        {
            title: { type: String, required: true },
            desc: { type: String, required: true },
            listType: { type: String, enum: ['numbered', 'none'], default: 'none' },
            items: [{ type: String }] // Array string untuk poin-poin list
        }
    ],
    footerNote: { type: String }
}, {
    timestamps: true,
});

const ReturnPolicy = mongoose.model('ReturnPolicy', returnPolicySchema);
export default ReturnPolicy;