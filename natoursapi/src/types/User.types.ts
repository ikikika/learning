import { Document, Model } from "mongoose";

export interface User {
  name: string;
  email: string;
  photo: string;
  password?: string;
  passwordConfirm?: string;
}

interface UserBaseDocument extends User, Document {
  comparePassword(
    candidatePassword: string,
    userPassword: string | undefined
  ): boolean;
}

// for strong typing if model has dependencies on other models
export interface UserDocument extends UserBaseDocument {}

// For model
export interface UserModel extends Model<UserDocument> {}
