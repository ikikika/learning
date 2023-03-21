import { UserDocument } from "./User.types";

export {};

declare global {
  namespace Express {
    interface Request {
      find: (input: object) => void;
      user: UserDocument;
    }
  }
}
