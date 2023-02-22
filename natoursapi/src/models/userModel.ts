import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

import { UserProps } from "../types/User.types";

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
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
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
  passwordChangedAt: Date,
});

// pre save is the moment when we erceive the data and before saving to the database
userSchema.pre("save", async function (this: UserProps, next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  // we only need it for validation
  // no need to persist it to database
  this.passwordConfirm = undefined;
  next();
});

const User = model("User", userSchema);

export default User;
