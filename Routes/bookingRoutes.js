import express from 'express';
import { protect } from '../controllers/authController.js';
import { getCheckoutSession } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.get('/checkout-session/:tourID', protect, getCheckoutSession);

export default bookingRouter;
