/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoClient } from "mongodb";

const MONGODB_URI =
  process.env.NEXT_MONGODB_URL || "mongodb://localhost:27017/blog";
const MONGODB_DB = process.env.NEXT_MONGODB_DB || "blog";

// Check if we have a cached connection
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // If no cached connection, create a new one
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);

  // Cache the connection
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
