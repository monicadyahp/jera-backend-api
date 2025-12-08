// backend/models/SkinAnalysisConfig.js
import mongoose from 'mongoose';

const skinAnalysisConfigSchema = mongoose.Schema({
    // Kategori: 'Kulit Bersih', 'Berjerawat Ringan', 'Berjerawat Sedang', 'Berjerawat Parah'
    condition: { 
        type: String, 
        required: true, 
        unique: true 
    }, 
    advice: { 
        type: String, 
        required: true 
    },
    // Relasi ke Produk yang disarankan
    suggestedProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    // Relasi ke Treatment yang disarankan
    suggestedTreatments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Treatment'
        }
    ]
}, {
    timestamps: true,
});

const SkinAnalysisConfig = mongoose.model('SkinAnalysisConfig', skinAnalysisConfigSchema);
export default SkinAnalysisConfig;