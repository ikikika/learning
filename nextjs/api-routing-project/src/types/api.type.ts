import { CommentType } from "./comment.type";

export type NewsletterResponseType = {
  message: string;
};

export type CommentResponseType = {
  message?: string;
  comments?: CommentType[];
  comment?: CommentType;
};
