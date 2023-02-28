import { Document, Model } from "mongoose";

export interface User {
  name: string;
  email: string;
  photo: string;
  role: string;
  password?: string;
  passwordConfirm?: string;
}

interface UserBaseDocument extends User, Document {
  comparePassword(
    candidatePassword: string,
    userPassword: string | undefined
  ): boolean;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
  passwordResetToken?: string;
  passwordResetExpires?: number;
}

// for strong typing if model has dependencies on other models
export interface UserDocument extends UserBaseDocument {}

// For model
export interface UserModel extends Model<UserDocument> {}
