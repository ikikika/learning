import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";

import mongoose from "mongoose";

dotenv.config();

const app = express();

const DB = process.env.DATABASE!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);

mongoose.connect(DB, {}).then(() => console.log("DB connection successful"));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tour must have name"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "Tour must have price"],
  },
});

const Tour = mongoose.model("Tour", tourSchema);

const testTour = new Tour({
  name: "Forest Hike",
  rating: 4.2,
  price: 497,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
