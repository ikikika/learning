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

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
