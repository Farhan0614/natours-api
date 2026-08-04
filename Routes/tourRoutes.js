import express from 'express';
import {
  aliasTopTours,
  createTour,
  deleteTour,
  getAllTours,
  getMonthlyPlan,
  getTour,
  getTourStats,
  updateTour,
} from '../controllers/tourController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const tourRouter = express.Router();
// tourRouter.param('id', checkID);
tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);
tourRouter.route('/tour-stats').get(getTourStats);
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);

tourRouter.route('/').get(protect, getAllTours).post(createTour);
tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default tourRouter;
// commit no 2
