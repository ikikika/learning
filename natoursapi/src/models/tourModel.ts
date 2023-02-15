import { Query, Schema, model } from "mongoose";
import slugify from "slugify";
// import validator from "validator";

interface PriceDiscountProps extends Function {
  price: number;
}

const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"], // validator
      unique: true,
      trim: true, // only for strings
      maxlength: [40, "A tour name must have less or equal then 40 characters"], // validator, for strings
      minlength: [10, "A tour name must have more or equal then 10 characters"], // validator
      // validate: [validator.isAlpha, "Tour name must only contain characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"], // validator
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"], // validator
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"], // validator, for strings
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"], // validator, for strings or dates
      max: [5, "Rating must be below 5.0"], // validator
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"], // validator
    },
    priceDiscount: {
      type: Number,
      validate: {
        // custom validator
        validator: function (this: PriceDiscountProps, val: number) {
          // `this` only points to current doc on NEW document creation. not going to work on update
          // in this situation, we only need `this` because we are comparing with another key
          return val < this.price;
        },
        // {VALUE} is native to mongoose, have access to input value
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"], // validator
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"], // validator
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // exclude from results
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// must use regular function because we need `this` keyword
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// this is also called a pre-save hook
tourSchema.pre("save", function (next) {
  // in this example, we are using the name and slugify function to generate a slug for the document just before saving to database
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

interface thisProp extends Query<any, any, {}, any> {
  start: number;
}

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function (this: thisProp, next) {
  // this will affect ALL find queries, outputting only the tours that satisfy this condition
  this.find({ secretTour: { $ne: true } });

  // used to find how long a query took to run
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (this: thisProp, docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
  // this will apply to all aggregation pipelines
  // this.pipeline is just an array
  // to add a stage to the start of the array, use unshift
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

const Tour = model("Tour", tourSchema);

export default Tour;
