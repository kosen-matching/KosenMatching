import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, nickname, email, tags } = body; // tagsを追加

    // 簡易的なバリデーション
    if (!content || !nickname || !email) {
      return NextResponse.json({ message: "Required fields are missing." }, { status: 400 });
    }

    // ここでデータベースに保存する処理を実装します
    // 例: await db.questions.create({ data: { title, content, nickname, email, tags } });

    console.log("Received new direct question:", { title, content, nickname, email, tags });

    return NextResponse.json({ message: "Question submitted successfully!", data: body }, { status: 200 });

  } catch (error) {
    console.error("Error submitting direct question:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
} 