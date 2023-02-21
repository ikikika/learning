import express, { Request, Response, NextFunction } from "express";

import { json } from "body-parser";
import tourRoutes from "./routes/tourRoutes";
import userRoutes from "./routes/userRoutes";
import { AppError } from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";

const app = express();

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
