import { RequestHandler } from "express";

import Tour from "../models/tourModel";

export const aliasTopTours: RequestHandler = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingAverage,summary,difficulty";
  next();
};

export const createTour: RequestHandler = async (req, res, next) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const getAllTours: RequestHandler = async (req, res, next) => {
  try {
    // BUILD QUERY
    // 1A. BASIC FILTERING
    // req.query will get parameters from the url, eg ...&sort=1&difficulty=2
    // mongoose has built-in filtering function
    // destructuring, create a new object with all the key value pairs in req.query
    // basic filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    // remove those fields from queryObj
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B. ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2.SORTING
    if (req.query.sort && typeof req.query.sort === "string") {
      const sortBy = req.query.sort.split(",").join(" ");
      console.log(req.query.sort);
      query = query.sort(sortBy);
    } else {
      query.sort("-createdAt");
    }

    // 3. Field Limiting
    if (req.query.fields && typeof req.query.fields === "string") {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // 4. Pagination
    const page = req.query.page ? Number(req.query.page) * 1 : 1;
    const limit = req.query.limit ? Number(req.query.limit) * 1 : 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const noTours = await Tour.countDocuments();
      if (skip >= noTours) {
        throw new Error("This page does not exist");
      }
    }

    // EXECUTE QUERY
    const tours = await query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const getTour: RequestHandler = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const updateTour: RequestHandler = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id, // id of document to be updated
      req.body, // data to update document
      {
        new: true, // return the updated document
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const deleteTour: RequestHandler = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
