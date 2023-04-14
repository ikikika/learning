import { ObjectId } from "mongodb";

export interface EventType {
  title: string;
  image: string;
  date: string;
  location: string;
  id: string;
  description?: string;
  _id?: ObjectId | undefined | string;
  isFeatured?: boolean;
}
