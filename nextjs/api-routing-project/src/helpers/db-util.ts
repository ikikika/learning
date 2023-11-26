import { Document, MongoClient, OptionalId } from "mongodb";

const DB = process.env.DATABASE!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);

export async function connectDatabase() {
  const client = await MongoClient.connect(DB);
  return client;
}

export async function insertDocument(
  client: MongoClient,
  collection: string,
  document: OptionalId<Document>
) {
  const db = client.db();

  const result = await db.collection(collection).insertOne(document);

  return result;
}

export async function getAllDocuments(
  client: MongoClient,
  collection: string,
  sort: {}
) {
  const db = client.db();

  const documents = await db.collection(collection).find().sort(sort).toArray();

  return documents;
}
