import mongoose from 'mongoose';

const siteSettingSchema = mongoose.Schema({
    siteName: { type: String, default: 'The Aesthetics Skin' },
    whatsappMain: { type: String, default: '628123456789' }, // Nomor WA Pusat
    emailSupport: { type: String, default: 'support@theaesthetics.id' },
    
    // Social Media Links
    socialInstagram: { type: String, default: 'https://instagram.com/' },
    socialTiktok: { type: String, default: 'https://tiktok.com/' },
    socialFacebook: { type: String, default: 'https://facebook.com/' },
    
    // Fitur Tambahan: Pengumuman Bar (Biar rame)
    announcementText: { type: String, default: 'Promo Spesial: Diskon 50% All Items!' },
    showAnnouncement: { type: Boolean, default: true }
}, {
    timestamps: true
});

const SiteSetting = mongoose.model('SiteSetting', siteSettingSchema);
export default SiteSetting;