import { NextResponse } from 'next/server';
import { kosenList } from '@/lib/kosen-data';
import { getDb } from '@/lib/db';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Generates a summary of a Kosen in English based on provided texts using Gemini.
 * @param inputText - Combined text from reviews (title, pros, cons, etc.).
 * @param kosenName - The name of the Kosen.
 * @returns An English summary string.
 */
async function generateSummaryInEnglish(inputText: string, kosenName: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set.');
    return `(Skipped) API key not available for ${kosenName}.`;
  }
  
  const prompt = `
    Analyze the following student reviews for "${kosenName}". 
    Based on the reviews, provide a concise summary in English. 
    The summary should cover the key characteristics of the school, what students learn, student life, and the main pros and cons mentioned.

    Reviews:
    ---
    ${inputText}
    ---

    English Summary:
  `;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Error generating summary for ${kosenName}:`, response.status, errorBody);
      return `An error occurred while generating the summary for ${kosenName}.`;
    }

    const responseData = await response.json();
    return responseData.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error(`Error generating summary for ${kosenName}:`, error);
    return `An error occurred while generating the summary for ${kosenName}.`;
  }
}

/**
 * 高専ごとの質問・体験談を要約し、データベースに保存するAPI
 * Vercel Cron Jobsなどから定期的に呼び出されることを想定しています。
 * 
 * @param request 
 * @returns 
 */
export async function GET(request: Request) {
  // TODO: Cronシークレットの検証
  // const authHeader = request.headers.get('authorization');
  // if (authHeader !== `Bearer ${CRON_SECRET}`) {
  //   return new Response('Unauthorized', {
  //     status: 401,
  //   });
  // }

  try {
    console.log('高専情報の要約処理を開始します...');
    const db = await getDb();
    const kosens = kosenList;
    console.log(`${kosens.length}件の高専が見つかりました。`);

    // 2. 高専ごとに要約を生成・保存する
    for (const kosen of kosens) {
      console.log(`[${kosen.name}] の処理を開始...`);

      // 2a. 高専に関連する体験談を取得する
      const reviews = await db.collection('reviews').find({ kosenId: kosen.id }).toArray();

      if (reviews.length === 0) {
        console.log(`[${kosen.name}] に関連する体験談がありません。スキップします。`);
        continue;
      }

      console.log(`[${kosen.name}] の体験談が ${reviews.length}件見つかりました。`);

      // 2b. 取得した体験談のテキストを結合
      const inputText = reviews.map(review => {
        // レビューの型が不明なため、anyとしてアクセス
        const r = review as any;
        return `
---
タイトル: ${r.title || ''}
良かった点: ${r.pros || ''}
微妙だった点: ${r.cons || ''}
自由記述: ${r.content || ''}
---
        `.trim();
      }).join('\n\n');

      // 2c. AIモデルを呼び出して "英語" の要約を生成する
      console.log(`Generating English summary for [${kosen.name}]...`);
      const summary = await generateSummaryInEnglish(inputText, kosen.name);
      
      // 2d. 生成した英語の要約をデータベースに保存する
      await db.collection('kosen_summaries').updateOne(
        { kosenId: kosen.id },
        { $set: { kosenId: kosen.id, summary: summary, updatedAt: new Date() } },
        { upsert: true }
      );
      console.log(`[${kosen.name}] の英語要約を保存しました。`);
    }

    console.log('すべての高専の英語要約処理が完了しました。');
    return NextResponse.json({ success: true, message: 'Kosen English summaries updated successfully.' });
  } catch (error) {
    console.error('要約処理中にエラーが発生しました:', error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: 'An unknown error occurred' }, { status: 500 });
  }
} 