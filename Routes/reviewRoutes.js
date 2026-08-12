import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  setTourUserIds,
  updateReview,
} from '../controllers/reviewController.js';

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(protect);

// automatically set tour and user IDs for nested routes with the help of mergeParams: true in the router command above. This allows us to access the tourId from the parent route and set it in the request body for creating a review. Similarly, we can set the user ID from the authenticated user.
reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);

reviewRouter
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('admin', 'user'), updateReview)
  .delete(restrictTo('admin', 'user'), deleteReview);

export default reviewRouter;
