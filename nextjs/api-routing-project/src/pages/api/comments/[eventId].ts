import {
  connectDatabase,
  getAllDocuments,
  insertDocument,
} from "@/helpers/db-util";
import { CommentResponseType } from "@/types/api.type";
import { CommentType } from "@/types/comment.type";
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommentResponseType>
) {
  const eventId = req.query.eventId;

  let client;

  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  if (req.method === "POST") {
    const { email, name, text } = req.body;

    if (
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !text ||
      text.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid input." });
      client.close();
      return;
    }

    const newComment: MongoCommentType = {
      email,
      name,
      text,
      eventId,
    };

    let result;

    try {
      result = await insertDocument(client, "comments", newComment);
      newComment._id = result.insertedId;
      res.status(201).json({ message: "Added comment.", comment: newComment });
    } catch (error) {
      res.status(500).json({ message: "Inserting comment failed!" });
    }
  }

  if (req.method === "GET") {
    try {
      const documents = await getAllDocuments(client, "comments", { _id: -1 });
      res.status(200).json({ comments: documents as CommentType[] });
    } catch (error) {
      res.status(500).json({ message: "Getting comments failed." });
    }
  }
}

export default handler;

interface MongoCommentType extends Omit<CommentType, "_id"> {
  _id?: ObjectId | undefined;
}
