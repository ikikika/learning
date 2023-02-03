import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import tourRoutes from "./routes/tourRoutes";

dotenv.config();

const app = express();

const DB = process.env.DATABASE!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);

mongoose.connect(DB, {}).then(() => console.log("DB connection successful"));

app.use("/tours", tourRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
