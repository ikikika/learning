import { Document } from "mongoose";

export interface UserProps extends Document {
  name: string;
  email: string;
  photo: string;
  password: string;
  passwordConfirm?: string;
}
