import { connectDatabase, insertDocument } from "@/helpers/db-util";
import { NewsletterResponseType } from "@/types/api.type";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NewsletterResponseType>
) {
  if (req.method === "POST") {
    const userEmail = req.body.email;

    if (!userEmail || !userEmail.includes("@")) {
      res.status(422).json({ message: "Invalid email address." });
      return;
    }

    let client;

    try {
      client = await connectDatabase();
    } catch (error) {
      res.status(500).json({ message: "Connecting to the database failed!" });
      return;
    }

    try {
      await insertDocument(client, "newsletter", { email: userEmail });
      client.close();
    } catch (error) {
      res.status(500).json({ message: "Data insertion failed." });
    } finally {
      console.log("Database connection closed.");
      client.close();
    }

    res.status(201).json({ message: "Signed up!" });
  }
}

export default handler;
