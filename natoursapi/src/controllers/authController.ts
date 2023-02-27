import { RequestHandler } from "express";
// import { promisify } from "util";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import { sign, verify } from "jsonwebtoken";
import { AppError } from "../utils/appError";
import { Types } from "mongoose";

const signToken = (id: Types.ObjectId) => {
  return sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

interface JwtType {
  id?: string;
  iat?: number;
  exp?: number;
}

export const signup: RequestHandler = catchAsync(async (req, res, next) => {
  // only store these fields, not all fields cos users may spoof it
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "succcess",
    token,
    data: {
      user: newUser,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const token = signToken(user._id);
  // 3) If everything ok, send token to client
  res.status(201).json({
    status: "succcess",
    token,
  });
});

export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  // 2) Verification token
  // // -- doesnt work ---
  // // verify is an async function
  // // promisify makes the function return a promise
  // // promisify(verify)  <=>  verify now is the promise version of verify, next bracket are the arguments of verify
  // const decoded = await promisify(verify)(token, process.env.SECRET_KEY);
  // // ---------------

  const jwtVerifyPromisified = (token: string, secret: string) => {
    return new Promise<JwtType>((resolve, reject) => {
      verify(token, secret, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          if (typeof decoded !== "string" && typeof decoded !== "undefined") {
            resolve(decoded);
          }
        }
      });
    });
  };

  const decoded = await jwtVerifyPromisified(token, process.env.JWT_SECRET!);

  // // 3) Check if user still exists
  const currentUser = await User.findById(decoded!.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat!)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

// pass arguments into middleware, use a wrappper function
export const restrictTo = (...roles: string[]): RequestHandler => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    // we are able to use req.user.role here because in the previous `protect` middleware, we set `req.user = currentUser;`
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
});
