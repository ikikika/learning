import express, { Request, Response, NextFunction } from "express";

import { json } from "body-parser";
import tourRoutes from "./routes/tourRoutes";
import userRoutes from "./routes/userRoutes";
import { AppError } from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import { rateLimit } from "express-rate-limit";

const app = express();

// 1) GLOBAL MIDDLEWARES

// Limit requests from same API
const limiter = rateLimit({
  max: 100, // 100 requests
  windowMs: 60 * 60 * 1000, // per hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// register and execute as middleware
app.use(json());

app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);

// capture all other routes. must be below all defined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!!!!!`, 404));
});

app.use(globalErrorHandler);

export default app;
