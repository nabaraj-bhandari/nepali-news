// lib/mongodb.ts

import { MongoClient } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error("Please add MONGO_URI in .env.local");
}

const client = new MongoClient(process.env.MONGO_URI);
const clientPromise = client.connect();

export default clientPromise;
