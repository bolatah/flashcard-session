import mongoDBConnect from "@/config/database";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { options } from "./auth/[...nextauth]";
import { Types } from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await mongoDBConnect;
  const session = await getServerSession(req, res, options);
  if (!session) {
    return res.status(500).json("There is no session");
  } else {
    const getUser = async (req: NextApiRequest) => {
      try {
        const email = session?.user.email;
        const res = await client
          .db()
          .collection("users")
          .findOne({ email: email });
        return res;
      } catch (error) {
        console.log(error);
      }
    };

    if (req.method === "POST") {
      try {
        const user = await getUser(req);

        let { turkishText, englishText } = req.body;
        turkishText = turkishText.trim();
        englishText = englishText.trim();

        const existingFlashcard = await client
          .db()
          .collection("flashcards")
          .findOne({
            $or: [{ turkishText }, { englishText }],
            author: user,
          });

        if (existingFlashcard) {
          return res
            .status(400)
            .json({ message: "Flashcard with the same text already exists" });
        } else {
          await client
            .db()
            .collection("flashcards")
            .insertOne({ ...req.body, author: user?._id });
          return res.status(201).json({
            message: "Flashcard created successfully",
          });
        }
      } catch (error: any) {
        return res.status(500).json({ message: error.message });
      }
    } else if (req.method === "GET") {
      try {
        const user = await getUser(req);
        if (!user) {
          return res
            .status(404)
            .json({ message: "There is no authorized user" });
        }
        const flashcardsCursor = client.db().collection("flashcards").find({
          author: user._id,
        });

        const flashcardsArray = await flashcardsCursor.toArray();

        if (flashcardsArray.length > 0) {
          return res.status(200).json(flashcardsArray);
        } else {
          return res.status(204).send("There is no flashcard"); // Return 204 No Content
        }
      } catch (error: any) {
        return res.status(500).json({ message: error.message });
      }
    } else if (req.method === "PATCH") {
      try {
        const update = req.body;
        const { id } = req.query;
        const objectId = id
          ? new Types.ObjectId(id as string)
          : new Types.ObjectId("");
        await client
          .db()
          .collection("flashcards")
          .findOneAndUpdate({ _id: objectId }, { $set: update })
          .then(() => {
            res.status(201).json({ success: true, update: update });
          });
      } catch (error: any) {
        return res.status(500).json({ message: error.message });
      }
    } else if (req.method === "DELETE") {
      try {
        const { id } = req.query;
        const objectId = id
          ? new Types.ObjectId(id as string)
          : new Types.ObjectId("");
        await client
          .db()
          .collection("flashcards")
          .findOneAndDelete({ _id: objectId });
        return res
          .status(200)
          .json({ message: `Flashcard with id ${id} deleted successfully` });
      } catch (error: any) {
        return res.status(500).json({ message: error.message });
      }
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  }
}
