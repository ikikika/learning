import { MongoClient } from "mongodb";

const DB = process.env.DATABASE!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);

export async function connectToDatabase() {
  const client = await MongoClient.connect(DB);
  return client;
}
