import express from 'express';
import { router as authRouter } from './auth.js';
import { router as scanRouter } from './scan.js'; 
import { router as userRouter } from './user.js';
import { router as productRouter } from './product.js';
import { router as treatmentRouter } from './treatment.js';
import { router as blogRouter } from './blog.js';
import { router as testimoniRouter } from './testimoni.js';
import { router as contactRouter } from './contact.js';
import { router as tncRouter } from './tnc.js';
import { router as faqRouter } from './faq.js';
import { router as returnRouter } from './returnPolicy.js';
import { router as promoRouter } from './promo.js';
import { router as rewardRouter } from './reward.js';
import { router as bookingRouter } from './booking.js';
import { router as wishlistRouter } from './wishlist.js';
import { router as cartRouter } from './cart.js';
import { router as orderRouter } from './order.js';
import { router as reviewRouter } from './review.js'; // <--- 1. TAMBAHAN IMPORT BARU
import { router as skinAnalysisRouter } from './skinAnalysis.js'; // <--- 1. IMPORT
import { router as settingRouter } from './setting.js'; // <--- IMPORT
import { router as newsletterRouter } from './newsletter.js'; // <--- 1. TAMBAHKAN INI

const router = express.Router();

// --- PERBAIKAN: TARUH SCAN ROUTER DI PALING ATAS ---
router.use('/', scanRouter); 

router.use('/', authRouter);
router.use('/users', userRouter);
router.use('/', productRouter);
router.use('/', treatmentRouter);
router.use('/', blogRouter);
router.use('/', testimoniRouter);
router.use('/', contactRouter);
router.use('/', tncRouter);
router.use('/', faqRouter);
router.use('/', returnRouter);
router.use('/', promoRouter);
router.use('/', rewardRouter);
router.use('/', bookingRouter);
router.use('/', wishlistRouter);
router.use('/', cartRouter);
router.use('/', orderRouter);
router.use('/', reviewRouter); // <--- 2. TAMBAHAN USE BARU
router.use('/', skinAnalysisRouter); // <--- 2. GUNAKAN
router.use('/', settingRouter); // <--- GUNAKAN
router.use('/', newsletterRouter); // <--- 2. GUNAKAN DISINI

export default router;