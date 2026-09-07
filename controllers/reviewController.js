import Review from '../models/reviewModel.js';
import Booking from '../models/bookingModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
// import catchAsync from '../utils/catchAsync.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory.js';

// export const getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };
//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

export const setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// user can only review the tour that he book
export const checkIfBooked = catchAsync(async (req, res, next) => {
  // We use req.body.tour and req.body.user because the setTourUserIds
  // middleware (which runs right before this) sets them up for us!
  const { tour, user } = req.body;

  // Check if a booking exists with this user and this tour
  const booking = await Booking.findOne({ tour, user });

  if (!booking) {
    return next(
      new AppError(
        'You can only review tours that you have actually booked.',
        403,
      ),
    );
  }

  // If the booking exists, let them create the review!
  next();
});

export const getAllReviews = getAll(Review);
export const getReview = getOne(Review);
export const createReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
