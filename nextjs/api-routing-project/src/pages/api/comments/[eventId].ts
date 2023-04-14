import { CommentResponseType } from "@/types/api.type";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommentResponseType>
) {
  const eventId = req.query.eventId;

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
      return;
    }

    const newComment = {
      email,
      name,
      text,
      eventId,
    };
    console.log(newComment);
    res.status(201).json({ message: "Added comment.", comment: newComment });
  }

  if (req.method === "GET") {
    const dummyList = [
      { id: "c1", name: "Mo", text: "sdasdas" },
      { id: "c2", name: "dfd", text: "fsdfasdfsdfds" },
    ];
    res.status(200).json({ comments: dummyList });
  }
}

export default handler;
