// src/controllers/bookingController.js
import Stripe from 'stripe';
import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import Booking from '../models/bookingModel.js';
import AppError from '../utils/appError.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory.js';

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourID); // Added await!

  // 2) Initialize Stripe with your secret key
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // 3) Create the checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // We point these URLs back to your Next.js frontend!
    // We include the query string hack (just like Jonas did) to create the booking later
    success_url: `${process.env.FRONTEND_URL}/?tour=${req.params.tourID}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${process.env.FRONTEND_URL}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100, // Stripe expects the amount in cents
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            // Note: Images hosted on localhost will NOT show up on the Stripe
            // Checkout page because Stripe's live servers cannot reach your computer.
            // When you deploy to production, this image will work perfectly.
            images: ['https://www.natours.dev/img/tours/tour-1-cover.jpg'],
          },
        },
        quantity: 1,
      },
    ],
  });

  // 4) Send the session to the Next.js client
  res.status(200).json({
    status: 'success',
    session,
  });
});

export const createMyBooking = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.body;

  if (!tour || !user || !price) {
    return next(new AppError('Incomplete booking data', 400));
  }

  await Booking.create({ tour, user, price });

  res.status(201).json({
    status: 'success',
    message: 'Booking successfully created',
  });
});

export const getMyBookings = catchAsync(async (req, res, next) => {
  // 1) Find all bookings for the currently logged in user
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Extract just the tour data from those bookings
  const tourIDs = bookings.map((el) => el.tour.id);

  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

export const createBooking = createOne(Booking);
export const getBooking = getOne(Booking);
export const getAllBooking = getAll(Booking);
export const updateBooking = updateOne(Booking);
export const deleteBooking = deleteOne(Booking);
