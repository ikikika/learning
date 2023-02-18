import { RequestHandler } from "express";
import Tour from "../models/tourModel";
import { APIFeatures } from "../utils/apiFeatures";
import catchAsync from "../utils/catchAsync";

export const aliasTopTours: RequestHandler = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,-ratingsAverage";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

export const getAllTours: RequestHandler = catchAsync(
  async (req, res, next) => {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  }
);

export const createTour: RequestHandler = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

export const getTour: RequestHandler = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

export const updateTour: RequestHandler = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(
    req.params.id, // id of document to be updated
    req.body, // data to update document
    {
      new: true, // return the updated document
      runValidators: true, // if set to false, mongoose will not check. not a good practice to set to false.
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

export const deleteTour: RequestHandler = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Aggregation
export const getTourStats: RequestHandler = catchAsync(
  async (req, res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  }
);

export const getMonthlyPlan: RequestHandler = catchAsync(
  async (req, res, next) => {
    const year = +req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
      {
        // deconstruct an array field from the input document and then output one document for each element of the array
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
  }
);
