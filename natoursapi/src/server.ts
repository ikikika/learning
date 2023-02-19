import * as dotenv from "dotenv";
import { connect } from "mongoose";
import app from "./app";

dotenv.config();

const DB = process.env.DATABASE!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);

connect(DB, {}).then(() => console.log("DB connection successful"));

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
