import { CommentType } from "./comment.type";
import { EventType } from "./event.type";

export type NewsletterResponseType = {
  message: string;
};

export type CommentResponseType = {
  message?: string;
  comments?: CommentType[];
  comment?: CommentType;
};

export type EventResponseType = {
  message?: string;
  events?: EventType[];
  event?: EventType;
};
