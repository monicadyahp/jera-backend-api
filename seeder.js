// backend/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Treatment from './models/Treatment.js'; 
import Blog from './models/Blog.js'; 
import Testimoni from './models/Testimoni.js'; 
import Contact from './models/Contact.js'; 
import Tnc from './models/Tnc.js'; 
import Faq from './models/Faq.js'; 
import ReturnPolicy from './models/ReturnPolicy.js'; 
import Promo from './models/Promo.js'; 
import Reward from './models/Reward.js'; 
import Booking from './models/Booking.js'; 
import Cart from './models/Cart.js';
import Wishlist from './models/Wishlist.js';
import SkinAnalysisConfig from './models/SkinAnalysisConfig.js'; 
import User from './models/User.js'; 

dotenv.config();

// =========================================
// 1. DATA PRODUK
// =========================================
const products = [
  {
    name: 'Barrier Bright Balm BBB',
    brand: 'The Aesthetics',
    category: 'daycream',
    description: 'Pelembap pagi yang mencerahkan dan memperbaiki skin barrier.',
    suitableFor: ['Kering', 'Sensitif'],
    price: 89000,
    countInStock: 50, 
    image: 'https://res.cloudinary.com/dbofowabd/image/upload/v1748105265/scan-img_ju8xb5.png',
  },
  {
    name: 'Xpert Ceramide Facial Wash',
    brand: 'Xpert',
    category: 'wash',
    description: 'Sabun pembersih wajah gentle tidak membuat kulit ketarik.',
    suitableFor: ['Kering', 'Normal'],
    price: 75000,
    countInStock: 50, 
    image: 'https://res.cloudinary.com/dbofowabd/image/upload/v1748105265/new1_el7cff.png',
  },
  {
    name: 'Acne Fighter Serum',
    brand: 'DermaCure',
    category: 'acne',
    description: 'Serum ampuh lawan jerawat membandel dan bekasnya.',
    suitableFor: ['Berminyak', 'Kombinasi'],
    price: 120000,
    countInStock: 50, 
    image: 'https://res.cloudinary.com/dbofowabd/image/upload/v1748105265/scan-img_ju8xb5.png',
  },
  {
    name: 'Acne Spot Gel',
    brand: 'DermaCure',
    category: 'acne',
    description: 'Obat totol jerawat ampuh kempeskan dalam semalam.',
    suitableFor: ['Berminyak', 'Berjerawat'],
    price: 45000,
    countInStock: 50, 
    image: 'https://res.cloudinary.com/dbofowabd/image/upload/v1748105265/new1_el7cff.png',
  },
  {
    name: 'Hydrating Toner',
    brand: 'AquaGlow',
    category: 'toner',
    description: 'Toner penyegar pH balance untuk hidrasi maksimal.',
    suitableFor: ['Normal', 'Kombinasi', 'Kering'],
    price: 55000,
    countInStock: 50, 
    image: 'https://res.cloudinary.com/dbofowabd/image/upload/v1748105265/new1_el7cff.png',
  },
  {
    name: 'Neostrata Bionic Cream',
    brand: 'Neostrata',
    category: 'neostrata',
    description: 'Krim perawatan intensif anti-aging premium.',
    suitableFor: ['Normal', 'Kering'],
    price: 350000,
    countInStock: 50, 
    image: 'https://res.cloudinary.com/dbofowabd/image/upload/v1748105265/scan-img_ju8xb5.png',
  },
  {
    name: 'Vitamin C Brightening Serum',
    brand: 'GlowLabs',
    category: 'serum',
    description: 'Serum Vitamin C murni untuk mencerahkan noda hitam.',
    suitableFor: ['Semua Jenis Kulit'],
    price: 150000,
    countInStock: 50, 
    image: 'https://res.cloudinary.com/dbofowabd/image/upload/v1748105265/scan-img_ju8xb5.png',
  },
  {
    name: 'AHA 10% Exfoliating Liquid',
    brand: 'SmoothSkin',
    category: 'aha',
    description: 'Cairan eksfoliasi untuk mengangkat sel kulit mati.',
    suitableFor: ['Kusam', 'Normal'],
    price: 99000,
    countInStock: 50, 
    image: 'https://res.cloudinary.com/dbofowabd/image/upload/v1748105265/new1_el7cff.png',
  },
  {
    name: 'Complete Glowing Package',
    brand: 'The Aesthetics',
    category: 'package',
    description: 'Paket lengkap (Wash, Toner, Serum, Cream) lebih hemat.',
    suitableFor: ['Semua Jenis Kulit'],
    price: 250000,
    countInStock: 50, 
    image: 'https://res.cloudinary.com/dbofowabd/image/upload/v1748105265/scan-img_ju8xb5.png',
  },
  {
    name: 'Acne Warrior Kit',
    brand: 'DermaCure',
    category: 'package',
    description: 'Paket perang lawan jerawat (Wash + Serum + Spot Gel).',
    suitableFor: ['Berjerawat'],
    price: 180000,
    countInStock: 50, 
    image: 'https://res.cloudinary.com/dbofowabd/image/upload/v1748105265/new1_el7cff.png',
  }
];

// =========================================
// 2. DATA TREATMENTS
// =========================================
const treatments = [
  {
    title: 'HydraFacial MD Elite',
    category: 'Face Treatment',
    price: 250000, 
    duration: '60 minutes',
    frequency: '1x per month',
    rating: 4.9,
    reviews: 127,
    description: 'Experience the ultimate in skincare with our HydraFacial MD Elite treatment. This revolutionary facial combines cleansing, exfoliation, extraction, hydration, and antioxidant protection in one session.',
    benefits: [
      'Meningkatkan kelembapan kulit mendalam',
      'Merangsang pembentukan kolagen dan elastin',
      'Membersihkan pori-pori tersumbat'
    ],
    tags: ['Acne Scar', 'Subcision', 'Face Treatment', 'Skin Texture'],
    img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    
    variants: [
      { name: 'Small Area', sub: '1-3 bekas jerawat', price: 250000 },
      { name: 'Medium Area', sub: '4-10 bekas jerawat', price: 350000 },
      { name: 'Full Face', sub: 'Seluruh wajah', price: 450000 }
    ],
    addons: [
      { name: 'Lidocaine & Canula', sub: 'Anestesi lokal', price: 50000 },
      { name: 'Extra Serum Vitamin C', sub: 'Booster cerah', price: 75000 }
    ],
    branches: ['Pejaten', 'Kemang', 'Tebet', 'Bekasi'],
    timeSlots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00']
  },
  {
    title: 'Skin Booster Injection',
    category: 'Face Treatment',
    price: 990000, 
    duration: '90 Menit',
    frequency: '1-3x per month',
    rating: 4.7,
    reviews: 85,
    description: 'Injeksi skin booster dilakukan untuk meningkatkan kelembapan kulit, meregenerasi sel kulit, serta merangsang pembentukan kolagen dan elastin. Perawatan ini baik untuk kulit yang kering, kusam, mulai mengalami penuaan.',
    benefits: ['Kulit lebih kenyal', 'Menyamarkan garis halus', 'Hidrasi maksimal'],
    tags: ['Face Treatment', 'Anti Aging', 'Injection'],
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    
    variants: [
        { name: 'Basic DNA Salmon', sub: '2ml', price: 990000 },
        { name: 'Premium DNA Salmon', sub: '4ml', price: 1800000 }
    ],
    addons: [{ name: 'Masker Gold', sub: 'After treatment', price: 100000 }],
    branches: ['Pejaten', 'Kemang'],
    timeSlots: ['10:00', '13:00', '16:00']
  },
  {
    title: 'Rejuve Pico Laser',
    category: 'Face Treatment',
    price: 199000, 
    duration: '90 Menit',
    frequency: '2x per week',
    rating: 4.8,
    reviews: 210,
    description: 'Perawatan PICO laser pada wajah bertujuan untuk meremajakan kulit, mengurangi tanda-tanda penuaan, dan kerutan halus di wajah. Sangat efektif untuk menghilangkan bekas jerawat hitam (PIH).',
    benefits: ['Mencerahkan wajah instan', 'Pudarkan bekas jerawat hitam', 'Ratakan warna kulit'],
    tags: ['Laser', 'Brightening', 'Face Treatment'],
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    
    variants: [
        { name: 'Single Treatment', sub: '1x Sesi', price: 199000 },
        { name: 'Bundle 5x', sub: 'Paket Hemat', price: 899000 }
    ],
    addons: [],
    branches: ['Pejaten', 'Bekasi', 'Tebet'],
    timeSlots: ['09:00', '11:00', '14:00', '17:00']
  },
  {
    title: 'Baby Stem Healer',
    category: 'Face Treatment',
    price: 2450000, 
    duration: '90 Menit',
    frequency: '1x per month',
    rating: 5.0,
    reviews: 42,
    description: 'Perawatan dengan metode injeksi berbasis Cell Therapy menggunakan Secretome, dengan kandungan growth factors, protein terlarut, sel imun, dan asam nukleat. Perawatan ini berfungsi untuk perbaikan jaringan.',
    benefits: ['Perbaikan jaringan kulit rusak', 'Anti inflamasi', 'Regenerasi sel baru'],
    tags: ['Stem Cell', 'Advanced', 'Face Treatment'],
    img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    
    variants: [
        { name: 'Standard', sub: '2.5ml', price: 2450000 }, 
        { name: 'Double Dose', sub: '5ml', price: 4500000 }
    ],
    addons: [{ name: 'Anestesi Cream', sub: 'Topikal', price: 0 }],
    branches: ['Kemang'],
    timeSlots: ['13:00', '15:00']
  }
];

// =========================================
// 3. DATA BLOG
// =========================================
const blogs = [
  {
    title: "Kenapa harus the aesthetics skin?",
    category: "Facial & Skincare",
    author: "The Aesthetics Team",
    date: "2 days ago",
    tag: "Facial & Skincare",
    imageMain: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2070&auto=format&fit=crop",
    description: "Lorem ipsum dolor sit amet consectetur. Aliquam aenean curabitur massa.",
    header1: "Keunggulan Teknologi Kami",
    content1: "Kami menggunakan teknologi terbaru dari Korea dan Eropa untuk memastikan kulit Anda mendapatkan perawatan terbaik. Mesin laser kami telah tersertifikasi FDA.",
    imageSecond: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop",
    header2: "Dokter Berpengalaman",
    content2: "Seluruh dokter kami telah menempuh pendidikan spesialis kulit dan estetika selama bertahun-tahun."
  },
  {
    title: "Rahasia Kulit Glowing Alami",
    category: "Facial & Skincare",
    author: "Dr. Ariana",
    date: "1 week ago",
    tag: "Tips & Trick",
    imageMain: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop",
    description: "Temukan rahasia perawatan kulit alami yang membuat wajahmu bersinar setiap hari.",
    header1: "Hidrasi adalah Kunci",
    content1: "Minum air putih 2 liter sehari dan penggunaan moisturizer yang tepat adalah kunci dasar kulit glowing.",
    imageSecond: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2070&auto=format&fit=crop",
    header2: "Pola Tidur",
    content2: "Tidur sebelum jam 11 malam membantu regenerasi sel kulit secara maksimal."
  },
  {
    title: "Pentingnya Sunscreen Harian",
    category: "Facial & Skincare",
    author: "Dermatologist",
    date: "3 days ago",
    tag: "Education",
    imageMain: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2070&auto=format&fit=crop",
    description: "Lindungi kulitmu dari sinar UV berbahaya dengan penggunaan sunscreen yang tepat.",
    header1: "Bahaya Sinar UV",
    content1: "Sinar UV A dan UV B dapat menyebabkan penuaan dini, flek hitam, hingga kanker kulit.",
    imageSecond: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2070&auto=format&fit=crop",
    header2: "Cara Pakai Sunscreen",
    content2: "Gunakan sebanyak dua ruas jari untuk seluruh wajah dan leher. Re-apply setiap 3-4 jam sekali."
  },
  {
    title: "Makanan Sehat untuk Kulit",
    category: "Food & Health",
    author: "Nutritionist",
    date: "5 hours ago",
    tag: "Health",
    imageMain: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2070&auto=format&fit=crop",
    description: "Daftar makanan super yang membantu menutrisi kulitmu dari dalam.",
    header1: "Sayuran Hijau",
    content1: "Bayam dan brokoli kaya akan antioksidan yang melawan radikal bebas.",
    imageSecond: "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=2073&auto=format&fit=crop",
    header2: "Ikan Berlemak",
    content2: "Salmon mengandung Omega-3 yang menjaga kelembapan dan elastisitas kulit."
  },
  {
    title: "Manfaat Body Scrub Mingguan",
    category: "Body Care",
    author: "Spa Therapist",
    date: "4 days ago",
    tag: "Body Care",
    imageMain: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop",
    description: "Mengangkat sel kulit mati agar kulit tubuh lebih halus dan cerah maksimal.",
    header1: "Eksfoliasi Tubuh",
    content1: "Rutin melakukan scrub 1-2 kali seminggu membantu kulit menyerap lotion lebih baik.",
    imageSecond: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop",
    header2: "Pilih Bahan Alami",
    content2: "Gunakan scrub dengan bahan dasar kopi atau gula untuk hasil yang lebih natural."
  },
  {
    title: "Mengenal Laser Rejuvenation",
    category: "Treatment",
    author: "Dr. Sinta",
    date: "1 day ago",
    tag: "Treatment",
    imageMain: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop",
    description: "Teknologi laser terbaru untuk meremajakan kulit wajah tanpa rasa sakit.",
    header1: "Cara Kerja Laser",
    content1: "Sinar laser menembus lapisan dermis untuk merangsang produksi kolagen baru.",
    imageSecond: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2070&auto=format&fit=crop",
    header2: "Downtime Minimal",
    content2: "Perawatan ini memiliki waktu pemulihan yang sangat cepat, cocok untuk wanita aktif."
  },
  {
    title: "Retinol: Teman atau Lawan?",
    category: "Facial & Skincare",
    author: "Beauty Editor",
    date: "6 hours ago",
    tag: "Ingredients",
    imageMain: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2070&auto=format&fit=crop",
    description: "Kupas tuntas penggunaan retinol untuk pemula agar tidak iritasi.",
    header1: "Mulai dari Dosis Rendah",
    content1: "Jangan langsung menggunakan persentase tinggi. Mulai dari 0.1% atau 0.5% seminggu sekali.",
    imageSecond: "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=2073&auto=format&fit=crop",
    header2: "Wajib Sunscreen",
    content2: "Retinol membuat kulit sensitif terhadap matahari, jadi sunscreen adalah harga mati."
  },
  {
    title: "Tips Rambut Bebas Ketombe",
    category: "Hair Care",
    author: "Hair Stylist",
    date: "2 weeks ago",
    tag: "Hair Care",
    imageMain: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=2069&auto=format&fit=crop",
    description: "Solusi ampuh mengatasi masalah kulit kepala kering dan berketombe.",
    header1: "Pilih Shampo yang Tepat",
    content1: "Gunakan shampo dengan kandungan Zinc Pyrithione atau Ketoconazole.",
    imageSecond: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2070&auto=format&fit=crop",
    header2: "Jangan Keramas Tiap Hari",
    content2: "Keramas terlalu sering justru menghilangkan minyak alami kulit kepala dan memicu ketombe."
  },
  {
    title: "Olahraga untuk Kulit Sehat",
    category: "Lifestyle",
    author: "Fitness Coach",
    date: "3 days ago",
    tag: "Health",
    imageMain: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop",
    description: "Bagaimana keringat saat berolahraga membantu detoksifikasi pori-pori.",
    header1: "Sirkulasi Darah",
    content1: "Olahraga memacu jantung memompa darah lebih cepat, membawa oksigen ke sel kulit.",
    imageSecond: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop",
    header2: "Hapus Makeup Dulu",
    content2: "Jangan pernah berolahraga menggunakan makeup tebal karena akan menyumbat pori."
  },
  {
    title: "Natural Makeup Look 2025",
    category: "Makeup",
    author: "MUA Artist",
    date: "12 hours ago",
    tag: "Trend",
    imageMain: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=2070&auto=format&fit=crop",
    description: "Tren makeup minimalis yang akan membuatmu terlihat segar sepanjang hari.",
    header1: "Skin Preparation",
    content1: "Kunci makeup natural adalah kulit yang terhidrasi dengan baik sebelum aplikasi foundation.",
    imageSecond: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop",
    header2: "Cream Blush",
    content2: "Gunakan blush on bertekstur krim untuk hasil rona pipi yang lebih menyatu."
  },
  {
    title: "Mengatasi Mata Panda",
    category: "Facial & Skincare",
    author: "Dr. Budi",
    date: "4 days ago",
    tag: "Tips & Trick",
    imageMain: "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=2073&auto=format&fit=crop",
    description: "Penyebab lingkaran hitam di bawah mata dan cara efektif mengatasinya.",
    header1: "Kurang Tidur",
    content1: "Faktor utama mata panda adalah kurang istirahat. Usahakan tidur 7-8 jam.",
    imageSecond: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2070&auto=format&fit=crop",
    header2: "Eye Cream Berkafein",
    content2: "Kandungan kafein pada eye cream membantu melancarkan pembuluh darah di area mata."
  },
  {
    title: "Tren Glass Skin Korea",
    category: "Lifestyle",
    author: "K-Beauty Expert",
    date: "1 week ago",
    tag: "Trend",
    imageMain: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2070&auto=format&fit=crop",
    description: "Langkah-langkah mendapatkan kulit sebening kaca ala artis Korea.",
    header1: "Double Cleansing",
    content1: "Langkah wajib untuk membersihkan sisa makeup dan debu hingga ke pori-pori.",
    imageSecond: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop",
    header2: "Layering Toner",
    content2: "Teknik 7 skin method atau menepuk toner berulang kali adalah rahasianya."
  }
];

// =========================================
// 4. DATA TESTIMONI
// =========================================
const testimonials = [
  {
    text: "Lorem ipsum dolor sit amet consectetur. Tortor in vitae feugiat in tristique mattis magna id tortor. Eros condimentum est ut et.",
    name: "Marvin McKinney",
    company: "The Walt Disney Company",
    image: "https://i.pravatar.cc/100?img=11",
    rating: 5
  },
  {
    text: "Pelayanan sangat memuaskan, kulit wajah saya jadi jauh lebih bersih dan glowing setelah perawatan rutin di sini.",
    name: "Floyd Miles",
    company: "Netflix",
    image: "https://i.pravatar.cc/100?img=12",
    rating: 5
  },
  {
    text: "Produk Acne Series-nya benar-benar ampuh! Jerawat batu saya kempes dalam 3 hari pemakaian rutin.",
    name: "Annette Black",
    company: "Apple Inc.",
    image: "https://i.pravatar.cc/100?img=5",
    rating: 5
  },
  {
    text: "Suka banget sama treatment HydraFacial-nya. Gak sakit sama sekali dan hasilnya instan kelihatan.",
    name: "Eleanor Pena",
    company: "Google",
    image: "https://i.pravatar.cc/100?img=8",
    rating: 4
  },
  {
    text: "Dokternya ramah dan sangat edukatif. Tidak memaksakan treatment yang tidak perlu.",
    name: "Leslie Alexander",
    company: "Amazon",
    image: "https://i.pravatar.cc/100?img=9",
    rating: 5
  },
  {
    text: "Tempatnya nyaman banget, bersih, dan estetik. Bakal jadi langganan tetap sih ini.",
    name: "Ronald Richards",
    company: "Starbucks",
    image: "https://i.pravatar.cc/100?img=13",
    rating: 5
  },
  {
    text: "Harga sangat affordable untuk kualitas pelayanan setara klinik premium di Jakarta Selatan.",
    name: "Guy Hawkins",
    company: "McDonalds",
    image: "https://i.pravatar.cc/100?img=33",
    rating: 5
  },
  {
    text: "Pengiriman produk cepat dan packaging aman. Terima kasih The Aesthetics Skin!",
    name: "Kristin Watson",
    company: "Facebook",
    image: "https://i.pravatar.cc/100?img=29",
    rating: 5
  },
  {
    text: "Konsultasi online-nya sangat membantu buat saya yang sibuk dan susah ke klinik langsung.",
    name: "Cody Fisher",
    company: "Twitter",
    image: "https://i.pravatar.cc/100?img=59",
    rating: 5
  },
  {
    text: "Akhirnya nemu sunblock yang nggak bikin whitecast dan minyakan. Recommended banget buat kulit sensitif.",
    name: "Cameron Williamson",
    company: "Adobe",
    image: "https://i.pravatar.cc/100?img=60",
    rating: 5
  },
  {
    text: "Treatment DNA Salmon-nya juara! Pori-pori langsung mengecil dan tekstur kulit jadi halus banget.",
    name: "Brooklyn Simmons",
    company: "Spotify",
    image: "https://i.pravatar.cc/100?img=44",
    rating: 5
  },
  {
    text: "Staff resepsionis sangat membantu mengatur jadwal, apalagi saya sering ganti jam dadakan. Top service!",
    name: "Jacob Jones",
    company: "Slack",
    image: "https://i.pravatar.cc/100?img=68",
    rating: 4
  },
  {
    text: "Awalnya ragu buat laser, tapi dokter nenangin banget dan prosesnya ternyata nggak sakit.",
    name: "Darlene Robertson",
    company: "Nintendo",
    image: "https://i.pravatar.cc/100?img=47",
    rating: 5
  },
  {
    text: "Produk tonernya menyegarkan banget. Wanginya soft dan nggak bikin pusing.",
    name: "Jerome Bell",
    company: "Google",
    image: "https://i.pravatar.cc/100?img=53",
    rating: 4
  },
  {
    text: "Sudah 3 bulan perawatan di sini, bekas jerawat PIH memudar signifikan. Thanks Dr. Ariana!",
    name: "Theresa Webb",
    company: "Pinterest",
    image: "https://i.pravatar.cc/100?img=49",
    rating: 5
  },
  {
    text: "Lokasinya strategis dan parkirannya luas. Interior kliniknya juga instagramable banget.",
    name: "Savannah Nguyen",
    company: "Uber",
    image: "https://i.pravatar.cc/100?img=41",
    rating: 5
  },
  {
    text: "Paket bundling skincare-nya jauh lebih hemat daripada beli satuan. Cocok buat mahasiswa.",
    name: "Esther Howard",
    company: "University Student",
    image: "https://i.pravatar.cc/100?img=32",
    rating: 5
  },
  {
    text: "Baru sekali coba facial wash-nya, komedo di hidung jadi lebih gampang dibersihkan.",
    name: "Ralph Edwards",
    company: "Freelancer",
    image: "https://i.pravatar.cc/100?img=15",
    rating: 4
  },
  {
    text: "Hasil scan wajah AI-nya akurat banget, rekomendasi produknya pas sesuai masalah kulit saya.",
    name: "Courtney Henry",
    company: "Microsoft",
    image: "https://i.pravatar.cc/100?img=20",
    rating: 5
  },
  {
    text: "Tidak pernah kecewa tiap datang ke sini. Selalu disambut hangat dan pulang dengan wajah fresh.",
    name: "Jane Cooper",
    company: "Airbnb",
    image: "https://i.pravatar.cc/100?img=24",
    rating: 5
  }
];

// =========================================
// 5. DATA CONTACT / OUTLET
// =========================================
const contacts = [
  { 
    name: 'The Aesthetics Skin Clinic Cabang Pejaten', 
    address: 'Jl. H. Samali No.57, Pejaten Barat, Ps. Minggu, Jakarta Selatan', 
    phone: '0877 8164 5578', 
    hours: 'Senin–Minggu 09.00 – 20.00',
    isNewOutlet: false
  },
  { 
    name: 'The Aesthetics Skin Clinic Cabang Melawai', 
    address: 'Jl. Wijaya VIII No. 2, Melawai, Jakarta Selatan', 
    phone: '0811 9899 922', 
    hours: 'Senin–Minggu 10.00 – 18.00',
    isNewOutlet: false
  },
  { 
    name: 'The Aesthetics Skin Clinic Cabang Kebayoran Lama', 
    address: 'Jl. Raya Kby. Lama No.50, Grogol Selatan, Kebayoran Lama, Jakarta Selatan', 
    phone: '0811 1180 0949', 
    hours: 'Senin–Minggu 09.00 – 17.00', 
    isNewOutlet: true 
  },
  { 
    name: 'The Aesthetics Skin Clinic Cabang Rawamangun', 
    address: 'Jl. Balai Pustaka Barat No. 726 FFB, Rawamangun, Pulo Gadung, Jakarta Timur', 
    phone: '0811 1000 9725', 
    hours: 'Senin–Minggu 09.00 – 17.00',
    isNewOutlet: false
  },
  { 
    name: 'The Aesthetics Skin Clinic Cabang Kalideres', 
    address: 'Jl. Perum Citra 7 Blok E01 No.10, Kalideres, Jakarta Barat', 
    phone: '0812 8890 3883', 
    hours: 'Senin–Minggu 09.00 – 17.00',
    isNewOutlet: false
  },
  { 
    name: 'The Aesthetics Skin Clinic Cabang Bogor', 
    address: 'Ruko Villa Indah Pajajaran Jl. Bangbarung Raya Blok AO, Bantarjati, Bogor', 
    phone: '0811 8882 1125', 
    hours: 'Senin–Minggu 09.00 – 17.00',
    isNewOutlet: false
  },
  { 
    name: 'The Aesthetics Skin Clinic Cabang Bintaro', 
    address: 'Jl. Bintaro Utama V Blok EA 1 No.15, Jurang Mangu Timur, Pondok Aren, Tangerang Selatan', 
    phone: '0811 1210 2102', 
    hours: 'Senin–Minggu 09.00 – 20.00',
    isNewOutlet: false
  },
  { 
    name: 'The Aesthetics Skin Clinic Cabang Bekasi', 
    address: 'Ruko RGJ 536 Grand Galaxy City Jl. Pulo Sirih Utama, Bekasi Selatan', 
    phone: '0811 8089 898', 
    hours: 'Senin–Minggu 10.00 – 18.00',
    isNewOutlet: false
  },
  { 
    name: 'The Aesthetics Skin Clinic Cabang Semarang', 
    address: 'Jl. Kedungmundu No.32, Tembalang, Semarang', 
    phone: '0877 3136 1401', 
    hours: 'Senin–Minggu 09.00 – 17.00', 
    isNewOutlet: true 
  }
];

// =========================================
// 6. DATA TNC
// =========================================
const tncData = [
  {
    order: 1,
    title: '1. Acceptance of Terms',
    type: 'paragraph',
    content: [
      'By visiting and using this website, you acknowledge that you have read, understood, and agreed to be bound by these Terms & Conditions. If you do not agree, please do not use our website.'
    ]
  },
  {
    order: 2,
    title: '2. Use of Website',
    type: 'list',
    content: [
      'This website is intended to provide information about beauty, skincare, and wellness services offered by The Aesthetics Skins.',
      'You agree not to misuse the website for unlawful purposes, including but not limited to: spreading harmful content, attempting to hack, or engaging in fraudulent activities.'
    ]
  },
  {
    order: 3,
    title: '3. Products & Services',
    type: 'list',
    content: [
      'All products, treatments, and services listed are subject to availability.',
      'Results may vary depending on individual skin types and conditions.',
      'The information provided on this website is for general knowledge and is not a substitute for professional medical advice.'
    ]
  },
  {
    order: 4,
    title: '4. Appointments & Bookings',
    type: 'list',
    content: [
      'Appointments made through this website are subject to confirmation.',
      'Cancellations or reschedules must be made at least 24 hours before the appointment time.',
      'Late arrivals may result in reduced treatment time.'
    ]
  },
  {
    order: 5,
    title: '5. Payments & Refunds',
    type: 'list',
    content: [
      'All prices listed are in local currency and subject to change without notice.',
      'Payments must be made in full at the time of service or purchase.',
      'Refunds are not provided for completed services. Product refunds are subject to our return policy.'
    ]
  },
  {
    order: 6,
    title: '6. Intellectual Property',
    type: 'list',
    content: [
      'All content on this website, including text, images, graphics, and logos, is the property of The Aesthetics Skins and may not be reproduced without written permission.'
    ]
  },
  {
    order: 7,
    title: '7. Limitation of Liability',
    type: 'list',
    content: [
      'The Aesthetics Skins is not liable for any adverse effects, allergic reactions, or dissatisfaction resulting from treatments or products.',
      'Clients are responsible for disclosing medical history, allergies, or skin sensitivities prior to treatments.'
    ]
  },
  {
    order: 8,
    title: '8. Privacy Policy',
    type: 'list',
    content: [
      'We respect your privacy and handle personal data in accordance with our Privacy Policy.',
      'Information collected will only be used for bookings, communication, and service improvement.'
    ]
  },
  {
    order: 9,
    title: '9. Changes to Terms',
    type: 'list',
    content: [
      'The Aesthetics Skins reserves the right to update or modify these Terms & Conditions at any time without prior notice.'
    ]
  }
];

// =========================================
// 7. DATA FAQ
// =========================================
const faqs = [
    {
        order: 1,
        category: 'The Aesthetics Skin',
        slug: 'aesthetics-skin', // Ini akan jadi ID untuk scroll
        items: [
            {
                question: 'Kenapa harus the aesthetics skin?',
                answer: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper eu nisl congue in ac praesent.'
            },
            {
                question: 'Apakah aman untuk kulit sensitif?',
                answer: 'Venenatis posuere dui pellentesque egestas sagittis aliquam gravida velit in.'
            },
            {
                question: 'Berapa lama hasil terlihat?',
                answer: 'Nulla leo nam ultrices id bibendum. Phasellus diam et posuere quisque nullam.'
            },
            {
                question: 'Apakah produk ini halal?',
                answer: 'Aliquam aenean curabitur massa condimentum phasellus aliquet tortor posuere.'
            }
        ]
    },
    {
        order: 2,
        category: 'Register',
        slug: 'register',
        items: [
            {
                question: 'Cara mendaftar akun baru?',
                answer: 'Lorem ipsum dolor sit amet consectetur. Aliquam aenean curabitur massa condimentum phasellus aliquet tortor posuere.'
            },
            {
                question: 'Lupa password akun?',
                answer: 'Nulla leo nam ultrices id bibendum. Phasellus diam et posuere quisque nullam.'
            }
        ]
    },
    {
        order: 3,
        category: 'Payment',
        slug: 'payment',
        items: [
            {
                question: 'Metode pembayaran apa saja?',
                answer: 'Nulla leo nam ultrices id bibendum. Phasellus diam et posuere quisque nullam.'
            },
            {
                question: 'Bagaimana konfirmasi pembayaran?',
                answer: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper eu nisl congue in ac praesent.'
            }
        ]
    },
    {
        order: 4,
        category: 'Booking',
        slug: 'booking',
        items: [
            {
                question: 'Cara reschedule jadwal?',
                answer: 'Lorem ipsum dolor sit amet consectetur. Aliquam aenean curabitur massa condimentum phasellus aliquet tortor posuere.'
            }
        ]
    }
];

// =========================================
// 8. DATA RETURN POLICY
// =========================================
const returnData = {
    title: "Refund and Returns",
    introTitle: "Kebijakan Pengembalian Produk dan Pengembalian Dana",
    introDesc: "Kebijakan Pengembalian dan Pengembalian Dana ini menjelaskan prosedur dan ketentuan terkait dengan pengembalian produk dan pengembalian dana. Dengan melakukan pembelian di situs web kami, Anda setuju untuk mematuhi kebijakan ini.",
    sections: [
        {
            title: "Pengembalian Produk & Refund Product (produk cacat, rusak atau tidak sesuai pesanan)",
            desc: "Jika ada barang yang diterima tidak sesuai dengan pesanan yang dilakukan, barang yang diterima cacat atau rusak, kamu bisa langsung konfirmasi melalui Customer Service kami di nomor +62xxxxxxx dengan syarat:",
            listType: "numbered",
            items: [
                "Klaim produk cacat, rusak atau tidak sesuai pesanan bisa dilakukan maksimal 1x24 jam setelah pesanan diterima.",
                "Mengisi format klaim.",
                "Wajib mengirim video unboxing tanpa edit dari sebelum hingga sesudah paket dibuka sebagai bukti ketidaksesuaian order (barang kurang atau salah produk) atau bukti barang cacat atau rusak.",
                "Menyertakan bukti Order ID",
                "Menyertakan bukti nomor resi pengiriman"
            ]
        },
        {
            title: "Verifikasi dan Persetujuan",
            desc: "Setelah mengajukan permohonan pengembalian barang atau refund dengan menyertakan syarat yang terlampir diatas, kami akan memverifikasi informasi tersebut. Pengembalian atau pengembalian dana akan disetujui berdasarkan kebijakan kami sesuai dengan ketentuan yang berlaku. Proses ini akan berlangsung & membutuhkan waktu maksimal 2x24 jam.",
            listType: "none",
            items: []
        },
        {
            title: "Pengembalian Barang, Pengiriman Kembali dan Proses Pengembalian Dana",
            desc: "Setelah proses verifikasi permohonan pengembalian barang atau refund selesai, kami akan melanjutkan proses klaim dan membutuhkan waktu 2x24 jam.",
            listType: "none",
            items: []
        },
        {
            title: "Pengecualian",
            desc: "Kebijakan ini tidak berlaku untuk produk yang tidak memenuhi syarat atau untuk kejadian di luar kendali kami seperti bencana alam atau kejadian yang tidak dapat dihindari.",
            listType: "none",
            items: []
        }
    ],
    footerNote: "Jika masih memiliki pertanyaan lebih lanjut atau perlu bantuan, silakan hubungi layanan pelanggan kami melalui email theaestheticsskin@gmail.com atau Customer Service +6281295924060."
};

// =========================================
// 9. DATA PROMO
// =========================================
const promos = [
    {
      title: 'GIFT VOUCHER',
      treatment: 'LIP LASER',
      value: 'Rp 300,000',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bg_color: '#E0D4EB'
    },
    {
      title: 'GIFT VOUCHER',
      treatment: 'ACNE PEEL',
      value: 'Rp 300,000',
      image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bg_color: '#E0D4EB'
    },
    {
      title: 'GIFT VOUCHER',
      treatment: 'GLOW FACIAL',
      value: 'Rp 300,000',
      image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bg_color: '#E0D4EB'
    },
];

// =========================================
// 10. DATA REWARD
// =========================================
const rewardsData = [
    // --- SECTION 1: HOW IT WORKS ---
    {
        type: 'how_it_works',
        order: 1,
        title: 'Sign up/Login',
        desc: 'Sign up or login if you already have an account at The Aesthetic Skin',
        icon: 'bx-user'
    },
    {
        type: 'how_it_works',
        order: 2,
        title: 'Shop & Earn',
        desc: 'Shop over Rp 100.000 at The Aesthetic Skin and earn 1 point for every Rp 1.000 spent',
        icon: 'bx-shopping-bag'
    },
    {
        type: 'how_it_works',
        order: 3,
        title: 'Redeem Points',
        desc: 'Redeem your points to get member only discount code',
        icon: 'bx-gift'
    },

    // --- SECTION 2: WAYS TO EARN ---
    {
        type: 'ways_to_earn',
        order: 1,
        points: '1 Point',
        desc: 'For every Rp 1.000 spent',
        sub: 'Shop minimum Rp 100.000',
        icon: 'bx-shopping-bag'
    },
    {
        type: 'ways_to_earn',
        order: 2,
        points: '100 Point',
        desc: 'Create an account/login',
        sub: '',
        icon: 'bx-user-circle'
    },
    {
        type: 'ways_to_earn',
        order: 3,
        points: '500 Point',
        desc: 'Complete your beauty profile',
        sub: '',
        icon: 'bx-clipboard'
    },
    {
        type: 'ways_to_earn',
        order: 4,
        points: '20 Point',
        desc: 'Leave a review on the website',
        sub: '',
        icon: 'bx-like'
    },

    // --- SECTION 3: REWARDS LIST ---
    {
        type: 'reward_list',
        order: 1,
        text: '100 Points = Rp 5.000 discounts'
    },
    {
        type: 'reward_list',
        order: 2,
        text: '500 Points = Rp 25.000 discounts'
    },
    {
        type: 'reward_list',
        order: 3,
        text: '1.000 Points = Rp 50.000 discounts'
    }
];

// =========================================
// 11. DATA BOOKING (DUMMY)
// =========================================
const bookings = [
    {
        firstName: 'Monica',
        lastName: 'Dyah',
        email: 'monica@example.com',
        whatsapp: '081234567890',
        date: '2025-12-01',
        time: '10.00',
        treatment: 'Skin Booster Injection', 
        branch: 'The Aesthetics Skin Clinic Cabang Pejaten', 
        problem: 'Ingin kulit lebih glowing',
        status: 'pending'
    },
    {
        firstName: 'Budi',
        lastName: 'Santoso',
        email: 'budi@example.com',
        whatsapp: '08987654321',
        date: '2025-12-02',
        time: '14.00',
        treatment: 'HydraFacial MD Elite',
        branch: 'The Aesthetics Skin Clinic Cabang Kemang',
        problem: 'Komedo membandel',
        status: 'confirmed'
    }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // 1. BERSIHKAN DATA LAMA
    console.log('🧹 Menghapus data lama...');
    await Product.deleteMany(); 
    await Treatment.deleteMany(); 
    await Blog.deleteMany(); 
    await Testimoni.deleteMany(); 
    await Contact.deleteMany();
    await Tnc.deleteMany(); 
    await Faq.deleteMany(); 
    await ReturnPolicy.deleteMany(); 
    await Promo.deleteMany(); 
    await Reward.deleteMany(); 
    await Booking.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await SkinAnalysisConfig.deleteMany(); 
    await User.deleteMany(); // <--- HAPUS USER LAMA

    // 2. INSERT DATA ADMIN & USER (PENTING!)
    console.log('👤 Membuat Akun Admin & User...');
    
    // --- AKUN ADMIN ---
    await User.create({
        name: 'Admin Toko',
        email: 'admin@example.com',
        password: '123456', 
        role: 'admin',      
        gender: 'Laki-Laki',
        phone: '081234567890',
        address: 'Kantor Pusat'
    });

    // --- AKUN USER BIASA (Untuk Tes) ---
    await User.create({
        name: 'User Biasa',
        email: 'user@example.com',
        password: '123456',
        role: 'user',
        gender: 'Perempuan',
        phone: '08987654321',
        address: 'Jl. Warga No 1'
    });

    // 3. INSERT DATA KONTEN
    console.log('📦 Mengisi data konten...');
    const createdProducts = await Product.insertMany(products);
    const createdTreatments = await Treatment.insertMany(treatments); 
    
    await Blog.insertMany(blogs);
    await Testimoni.insertMany(testimonials);
    await Contact.insertMany(contacts);
    await Tnc.insertMany(tncData); 
    await Faq.insertMany(faqs);
    await ReturnPolicy.create(returnData);
    await Promo.insertMany(promos);
    await Reward.insertMany(rewardsData);
    await Booking.insertMany(bookings);

    // 4. BUAT DATA REKOMENDASI DINAMIS (KODE YANG TIDAK BOLEH DIHILANGKAN)
    console.log('🧠 Mengkonfigurasi Rekomendasi AI...');
    
    // Helper cari ID produk/treatment by name partial
    const getProd = (namePart) => createdProducts.find(p => p.name.toLowerCase().includes(namePart.toLowerCase()))?._id;
    const getTreat = (namePart) => createdTreatments.find(t => t.title.toLowerCase().includes(namePart.toLowerCase()))?._id;

    const analysisConfigs = [
        {
            condition: 'Kulit Bersih',
            advice: 'Kulitmu sudah sangat sehat! Pertahankan dengan basic skincare (Facial Wash + Moisturizer + Sunscreen) agar tetap terlindungi dari polusi.',
            suggestedProducts: [
                getProd('Facial Wash'), 
                getProd('Hydrating Toner'),
                getProd('Complete Glowing') 
            ].filter(Boolean),
            suggestedTreatments: [
                getTreat('HydraFacial') 
            ].filter(Boolean)
        },
        {
            condition: 'Berjerawat Ringan',
            advice: 'Muncul sedikit jerawat? Jangan dipencet! Gunakan Acne Spot Gel pada jerawat aktif dan pastikan double cleansing setiap malam.',
            suggestedProducts: [
                getProd('Acne Spot Gel'),
                getProd('Acne Warrior Kit'),
                getProd('Facial Wash')
            ].filter(Boolean),
            suggestedTreatments: [
                getTreat('Rejuve Pico'), 
                getTreat('HydraFacial')
            ].filter(Boolean)
        },
        {
            condition: 'Berjerawat Sedang',
            advice: 'Peradangan mulai terlihat. Fokus pada ingredients menenangkan seperti Centella Asiatica dan Salicylic Acid. Hindari scrub kasar.',
            suggestedProducts: [
                getProd('Acne Fighter Serum'),
                getProd('Acne Warrior Kit'),
                getProd('Barrier Bright')
            ].filter(Boolean),
            suggestedTreatments: [
                getTreat('Skin Booster'),
                getTreat('Rejuve Pico')
            ].filter(Boolean)
        },
        {
            condition: 'Berjerawat Parah',
            advice: 'Kondisi ini memerlukan perhatian khusus. Disarankan untuk segera konsultasi dokter kami dan hindari penggunaan makeup tebal sementara waktu.',
            suggestedProducts: [
                getProd('Acne Fighter Serum'),
                getProd('Neostrata')
            ].filter(Boolean),
            suggestedTreatments: [
                getTreat('Baby Stem Healer'),
                getTreat('Rejuve Pico')
            ].filter(Boolean)
        }
    ];

    await SkinAnalysisConfig.insertMany(analysisConfigs);

    console.log('✅ SEMUA DATA TERMASUK REKOMENDASI AI & ADMIN BERHASIL DI-SEED!');
    console.log('------------------------------------------------');
    console.log('🔑 AKUN ADMIN:');
    console.log('   Email: admin@example.com');
    console.log('   Pass : 123456');
    console.log('------------------------------------------------');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();