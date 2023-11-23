import { NextApiRequest, NextApiResponse } from "next";
import { FeedbackType, buildFeedbackPath, extractFeedback } from "./feedback";

type Data = {
  feedback: FeedbackType | undefined;
};

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "DELETE") {
    // do something
  }
  const id = req.query.id;
  const filepath = buildFeedbackPath();
  const data = extractFeedback(filepath);

  const selectedFeedback = data.find((item) => item.id === id);

  res.status(200).json({ feedback: selectedFeedback });
}

export default handler;
