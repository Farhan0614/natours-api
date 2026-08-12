import mongoose from 'mongoose';
import slugify from 'slugify';
// import User from './userModel.js';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a tour must have a name'],
      unique: true,
      trim: true,
      minlength: [10, 'a tour name must have more or equal to 10 characters'],
      maxlength: [40, 'a tour name must have less or equal to 40 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'a tour mush have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour mush have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'a tour mush have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty id either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'a tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this keyword works only while creating a document not while updating
          //this only point to the current document new document creation
          return val < this.price;
        },
        message: 'discount price ({VALUE}) must be less then actual price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'a tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'a tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Document Middleware: run before .save() and .create()
tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

// (-<EMBEDDING FUNCTIONALITY>-)
// tourSchema.pre('save', async function () {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
// });

// tourSchema.pre('save', function () {
//   console.log('will save document');
// });

// tourSchema.post('save', function (doc) {
//   console.log(doc);
// });

// Query Middleware
tourSchema.pre(/^find/, function () {
  // tourSchema.pre('find', function () {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
});

tourSchema.pre(/^find/, async function () {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangesAt',
  });
});

tourSchema.post(/^find/, function (docs) {
  console.log(`Query took ${Date.now() - this.start} millisecond`);
});

// Aggregation Middleware
tourSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
