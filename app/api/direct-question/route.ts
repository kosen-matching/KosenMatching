import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { IDirectQuestion } from "@/lib/models/directQuestion.model"; // Keep for type definition

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const body = await request.json();
    const { title, content, nickname, email, tags } = body;

    if (!content || !nickname || !email) {
      return NextResponse.json({ message: "Required fields are missing." }, { status: 400 });
    }

    // Create a new document, MongoDB will generate the _id
    const newQuestion: Omit<IDirectQuestion, '_id'> = {
      title,
      content,
      nickname,
      email,
      tags,
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await db.collection<Omit<IDirectQuestion, '_id'>>('direct_questions').insertOne(newQuestion);

    console.log("Saved new direct question to DB with ID:", result.insertedId);

    return NextResponse.json({ message: "Question submitted successfully! It will be reviewed by an admin.", data: { insertedId: result.insertedId } }, { status: 201 });

  } catch (error) {
    console.error("Error submitting direct question:", error);
    if (error instanceof Error) {
        return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const db = await getDb();

    const questions = await db.collection<IDirectQuestion>('direct_questions')
      .find({ status: 'approved' })
      .sort({ approvedAt: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json(questions, { status: 200 });

  } catch (error) {
    console.error("Error fetching direct questions:", error);
     if (error instanceof Error) {
        return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
} 