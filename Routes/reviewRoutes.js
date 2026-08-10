import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import {
  createReview,
  getAllReviews,
} from '../controllers/reviewController.js';

const reviewRouter = express.Router({ mergeParams: true });

// automatically set tour and user IDs for nested routes with the help of mergeParams: true in the router command above. This allows us to access the tourId from the parent route and set it in the request body for creating a review. Similarly, we can set the user ID from the authenticated user.
reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);

export default reviewRouter;
