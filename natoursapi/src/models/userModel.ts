import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { UserDocument, UserModel } from "../types/User.types";

interface PasswordProps {
  password: string;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false, // never show the password in any output
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!! TO update users, use SAVE, not findoneandupdate
      validator: function (this: PasswordProps, el: string) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Number,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// pre save is the moment when we erceive the data and before saving to the database
userSchema.pre("save", async function (this: UserDocument, next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // Delete passwordConfirm field
  // we only need it for validation
  // no need to persist it to database
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next(); // exit this middleware if these condition satisfied

  this.passwordChangedAt = Date.now() - 1000; // else this line will execute
  next();
});

// instance method: a method that is availabel on all documents of the collection
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  // this.password not availabel because select for password is false
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User: UserModel = model<UserDocument, UserModel>("User", userSchema);

export default User;
