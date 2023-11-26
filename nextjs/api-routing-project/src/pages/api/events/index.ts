import { connectDatabase, getAllDocuments } from "@/helpers/db-util";
import { EventResponseType } from "@/types/api.type";
import type { NextApiRequest, NextApiResponse } from "next";
import { EventType } from "@/types/event.type";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventResponseType>
) {
  let client;

  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  if (req.method === "GET") {
    try {
      const documents = await getAllDocuments(client, "events", { _id: -1 });
      res.status(200).json({ events: documents as EventType[] });
    } catch (error) {
      res.status(500).json({ message: "Get comments failed." });
    } finally {
      console.log("Database connection closed.");
      client.close();
    }
  }
}

export default handler;
