import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";

import mongoose from "mongoose";

dotenv.config();

const app = express();

const DB = process.env.DATABASE!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);

mongoose.connect(DB, {}).then((con) => {
  console.log(con.connections);
  console.log("DB connection successful");
});

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
