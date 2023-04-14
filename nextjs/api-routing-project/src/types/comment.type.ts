import { ObjectId } from "mongodb";

export interface CommentType {
  _id?: ObjectId | undefined | string;
  text: string;
  name: string;
  email?: string;
  eventId?: string | string[];
}
