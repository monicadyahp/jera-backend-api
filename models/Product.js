// backend/models/Product.js
import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    
    // --- FIELD BARU: STOK ---
    countInStock: { type: Number, required: true, default: 0 }, 
    
    suitableFor: [{ type: String }],
    benefits: [{ type: String }],
    usage: { type: String },
    image: { type: String },
    link: { type: String },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;