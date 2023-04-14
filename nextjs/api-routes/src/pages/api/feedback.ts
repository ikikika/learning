import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type Data = {
  message: string;
  feedback: {
    id: string;
    email: string;
    text: string;
  };
};

function Handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    const email = req.body.email;
    const feedbackText = req.body.text;

    const newFeedback = {
      id: new Date().toISOString(),
      email: email,
      text: feedbackText,
    };

    const filepath = path.join(process.cwd(), "data", "feedback.json");
    const fileData = fs.readFileSync(filepath);
    const data = JSON.parse(fileData.toString());
    data.push(newFeedback);
    fs.writeFileSync(filepath, JSON.stringify(data));

    res.status(201).json({ message: "success", feedback: newFeedback });
  }
}

export default Handler;
