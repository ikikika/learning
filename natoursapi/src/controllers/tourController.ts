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
    const tours = await Tour.find();

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
