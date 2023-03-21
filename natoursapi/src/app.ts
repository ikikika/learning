import express from "express";

import { json } from "body-parser";
import tourRoutes from "./routes/tourRoutes";
import userRoutes from "./routes/userRoutes";
import { AppError } from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

const app = express();

// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet()); // should set this at the top

// Limit requests from same API
const limiter = rateLimit({
  max: 100, // 100 requests
  windowMs: 60 * 60 * 1000, // per hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// Use at the end to clean up query string

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// 2) ROUTES
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);

// capture all other routes. must be below all defined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!!!!!`, 404));
});

app.use(globalErrorHandler);

export default app;
