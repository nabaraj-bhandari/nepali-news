import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { News } from "@/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const news: News[] = req.body;

  try {
    const client = await clientPromise;
    const db = client.db("newsDB");
    await db.collection("news").insertMany(news);
    res.status(200).json({ message: "News saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save news" });
  }
}
