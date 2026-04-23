import dotenv from "dotenv";
dotenv.config();

import express from "express";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello Express + TypeScript 123");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
