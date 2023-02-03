import { RequestHandler } from "express";

import Tour from "../models/tourModel";

export const createTour: RequestHandler = (req, res, next) => {
  const testTour = new Tour({
    name: "Forest Hike 3",
    rating: 4.2,
    price: 497,
  });

  testTour
    .save()
    .then((data) => {
      res.status(201).json({ message: "Tour created.", createdTour: data });
    })
    .catch((err) => {
      throw new Error(err);
    });
};
