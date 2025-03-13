import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const posts = await db
      .collection("posts")
      .find({})
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const postData = await request.json();

    // If it's an update (has an id)
    if (postData.id) {
      const { id, ...updateData } = postData;
      const result = await db
        .collection("posts")
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...updateData, updatedAt: new Date().toISOString() } }
        );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      const updatedPost = await db
        .collection("posts")
        .findOne({ _id: new ObjectId(id) });
      return NextResponse.json(updatedPost);
    }
    // It's a new post
    else {
      const newPost = {
        ...postData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await db.collection("posts").insertOne(newPost);
      newPost._id = result.insertedId;

      return NextResponse.json(newPost);
    }
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
  }
}
