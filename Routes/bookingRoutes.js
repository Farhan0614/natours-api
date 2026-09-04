import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import {
  createBooking,
  createMyBooking,
  deleteBooking,
  getAllBooking,
  getBooking,
  getCheckoutSession,
  getMyBookings,
  updateBooking,
} from '../controllers/bookingController.js';

const bookingRouter = express.Router();
bookingRouter.use(protect);

bookingRouter.get('/checkout-session/:tourID', getCheckoutSession);
bookingRouter.post('/', createMyBooking);
bookingRouter.get('/my-bookings', getMyBookings);

bookingRouter.use(restrictTo('admin', 'lead-guide'));

bookingRouter.route('/').get(getAllBooking).post(createBooking);
bookingRouter
  .route('/:id')
  .get(getBooking)
  .patch(updateBooking)
  .delete(deleteBooking);

export default bookingRouter;
