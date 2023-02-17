import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import { connect } from "mongoose";
import { json } from "body-parser";
import tourRoutes from "./routes/tourRoutes";

dotenv.config();

const app = express();

const DB = process.env.DATABASE!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);

connect(DB, {}).then(() => console.log("DB connection successful"));

// register and execute as middleware
app.use(json());

app.use("/api/v1/tours", tourRoutes);

// capture all other routes. must be below all defined routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
