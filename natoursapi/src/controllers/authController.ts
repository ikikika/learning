import { RequestHandler } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import jwt from "jsonwebtoken";

export const signup: RequestHandler = catchAsync(async (req, res, next) => {
  // only store these fields, not all fields cos users may spoof it
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: "succcess",
    token,
    data: {
      user: newUser,
    },
  });
});
