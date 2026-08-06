import express from 'express';
import morgan from 'morgan';
import tourRouter from './Routes/tourRoutes.js';
import userRouter from './Routes/userRoutes.js';
import AppError from './utils/appError.js';
import { globalErrorHandler } from './controllers/errorController.js';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';

const app = express();
// Global Middlewares

// set security headers
app.use(helmet());

// set development environment
app.set('query parser', 'extended');
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit the requests from same api
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  message: 'Too many requests from this IP, please try again in an hour.',
});
app.use('/api', limiter);

// body parser reading the body from the request req.body
app.use(express.json({ limit: '10kb' }));

// serving static files
app.use(express.static('./public'));

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use((req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.statusCode = 404;
  // err.status = 'fail';

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
