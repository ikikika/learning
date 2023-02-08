import { RequestHandler } from "express";

import Tour from "../models/tourModel";

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
    // req.query will get parameters from the url, eg ...&sort=1&difficulty=2
    // destructuring, create a new object with all the key value pairs in req.query
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    // remove those fields from queryObj
    excludedFields.forEach((el) => delete queryObj[el]);

    const query = Tour.find(queryObj);

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
