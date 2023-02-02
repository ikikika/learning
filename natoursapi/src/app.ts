import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
