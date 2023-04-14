import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export type FeedbackType = {
  id: string;
  email: string;
  text: string;
};

type Data = {
  message: string;
  feedback: FeedbackType | FeedbackType[];
};

export function buildFeedbackPath() {
  return path.join(process.cwd(), "data", "feedback.json");
}

export function extractFeedback(filepath: string): FeedbackType[] {
  const fileData = fs.readFileSync(filepath);
  const data = JSON.parse(fileData.toString());
  return data;
}

function Handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    const email = req.body.email;
    const feedbackText = req.body.text;

    const newFeedback = {
      id: new Date().toISOString(),
      email: email,
      text: feedbackText,
    };

    const filepath = buildFeedbackPath();
    const data = extractFeedback(filepath);
    data.push(newFeedback);
    fs.writeFileSync(filepath, JSON.stringify(data));

    res.status(201).json({ message: "success", feedback: newFeedback });
  } else if (req.method === "GET") {
    const filepath = buildFeedbackPath();
    const data = extractFeedback(filepath);

    res.status(201).json({ message: "success", feedback: data });
  }
}

export default Handler;
