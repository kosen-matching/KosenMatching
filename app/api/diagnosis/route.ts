import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { kosenList } from '@/lib/kosen-data';
import { getDb } from '@/lib/db';
import type { Kosen } from '@/types/kosen';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 診断結果にマッチ度を追加するための新しい型
// interface DiagnosisResult extends Kosen {
//   matchRate: number;
//   matchReason: string;
// }

// 興味分野と学科名の関連付け
// const interestDepartmentMap: Record<string, string[]> = {
//   mechanical: ['機械'],
//   electrical: ['電気', '電子'],
//   information: ['情報', 'コンピュータ', 'ネットワーク', 'メディア'],
//   chemical: ['化学', '生物', '物質', '環境'],
//   architecture: ['建築', '土木', '都市', 'デザイン'],
//   marine: ['商船', '海洋'],
// };

// 得意科目と分野の関連付け
// const subjectInterestMap: Record<string, string[]> = {
//   math: ['mechanical', 'electrical', 'information'],
//   physics: ['mechanical', 'electrical'],
//   chemistry: ['chemical'],
//   biology: ['chemical'],
// };

// --- 回答を文章に変換するヘルパー ---
const answerMappings = {
  interests: { 'mechanical': '機械・ロボット', 'electrical': '電気・電子', 'information': '情報・コンピュータ', 'chemical': '化学・バイオ', 'architecture': '建築・土木', 'marine': '商船・海洋' },
  subjects: { 
    'good': '得意', 
    'normal': '普通', 
    'weak': '苦手', 
    'none': '未履修' 
  },
  subjectNames: {
    'math': '数学',
    'science': '理科',
    'english': '英語',
    'japanese': '国語',
    'socialStudies': '社会'
  },
  future: { 'engineer': 'エンジニアとして製品開発に携わりたい', 'researcher': '研究者として新しい技術を生み出したい', 'entrepreneur': '起業したい', 'global': '国際的に活躍したい', 'creative': 'ものづくりで社会貢献したい', 'undecided': 'まだ決まっていない' },
  personality: { 'logical': '論理的思考', 'creative': '創造的', 'practical': '実践的作業が好き', 'analytical': '分析が好き', 'team': 'チームでの協業を好む', 'independent': '独立して作業することを好む' },
  environment: {
    'very': 'とても重視',
    'somewhat': 'やや重視',
    'neutral': 'どちらでも',
    'not': '重視しない'
  },
  environmentItems: {
    'facilities': '充実した設備・機材',
    'dormitory': '寮生活の充実',
    'club': '部活動の充実',
    'international': '国際交流の機会',
    'practicalTraining': '企業実習・インターンシップ',
    'research': '研究活動の充実'
  },
  lifestyle: {
    'balance': '勉強と部活動・趣味をバランスよく楽しみたい',
    'studyFocus': '勉強・研究に集中したい',
    'clubFocus': '部活動やサークル活動を頑張りたい',
    'socialLife': '友人との交流を大切にしたい',
    'independent': '自立した生活を送りたい'
  },
  location: {
    'bigCity': '大都市（東京・大阪・名古屋など）',
    'mediumCity': '地方都市（県庁所在地など）',
    'suburban': '郊外・自然豊かな環境',
    'anywhere': '特にこだわらない',
    'nearHome': '実家から通える範囲'
  },
  clubActivities: {
    'robocon': 'ロボコン・技術系コンテスト',
    'sports': '体育系部活動',
    'culture': '文化系部活動',
    'volunteer': 'ボランティア活動',
    'none': '特に参加予定はない'
  },
  grade: {
    'ms1': '中学1年生',
    'ms2': '中学2年生',
    'ms3': '中学3年生',
  }
};

function convertAnswersToText(answers: any, grade?: string): string {
  const parts: string[] = [];
  
  // 学年
  const gradeKey = grade as keyof typeof answerMappings.grade;
  if (gradeKey && answerMappings.grade[gradeKey]) {
    parts.push(`現在の学年は「${answerMappings.grade[gradeKey]}」`);
  }
  
  // 興味分野
  const interestsKey = answers.interests as keyof typeof answerMappings.interests;
  if (interestsKey && answerMappings.interests[interestsKey]) {
    parts.push(`興味分野は「${answerMappings.interests[interestsKey]}」`);
  }
  
  // 教科の評価
  if (answers.subjects) {
    const subjectEvaluations: string[] = [];
    for (const [subjectId, evaluation] of Object.entries(answers.subjects)) {
      const subjectName = answerMappings.subjectNames[subjectId as keyof typeof answerMappings.subjectNames];
      const evaluationText = answerMappings.subjects[evaluation as keyof typeof answerMappings.subjects];
      if (subjectName && evaluationText) {
        subjectEvaluations.push(`${subjectName}は${evaluationText}`);
      }
    }
    if (subjectEvaluations.length > 0) {
      parts.push(`教科について：${subjectEvaluations.join('、')}`);
    }
  }

  // 偏差値
  if (answers.deviation) {
    parts.push(`現在の偏差値は ${answers.deviation} `);
  }
  
  // 将来
  const futureKey = answers.future as keyof typeof answerMappings.future;
  if (futureKey && answerMappings.future[futureKey]) {
    parts.push(`将来は「${answerMappings.future[futureKey]}」と考えている`);
  }
  
  // 性格
  const personalityKey = answers.personality as keyof typeof answerMappings.personality;
  if (personalityKey && answerMappings.personality[personalityKey]) {
    parts.push(`性格は「${answerMappings.personality[personalityKey]}」`);
  }

  // 環境
  if (answers.environment) {
    const importantItems: string[] = [];
    for (const [itemId, importance] of Object.entries(answers.environment)) {
      const itemName = answerMappings.environmentItems[itemId as keyof typeof answerMappings.environmentItems];
      if (itemName && (importance === 'very' || importance === 'somewhat')) {
        importantItems.push(itemName);
      }
    }
    if (importantItems.length > 0) {
      parts.push(`学習環境として「${importantItems.join('、')}」を重視している`);
    }
  }
  
  // 生活スタイル
  const lifestyleKey = answers.lifestyle as keyof typeof answerMappings.lifestyle;
  if (lifestyleKey && answerMappings.lifestyle[lifestyleKey]) {
    parts.push(`生活スタイルは「${answerMappings.lifestyle[lifestyleKey]}」`);
  }
  
  // 場所の希望
  const locationKey = answers.location as keyof typeof answerMappings.location;
  if (locationKey && answerMappings.location[locationKey]) {
    parts.push(`場所の希望は「${answerMappings.location[locationKey]}」`);
  }
  
  // 部活動 (複数選択対応)
  if (Array.isArray(answers.clubActivities) && answers.clubActivities.length > 0) {
    const interestedClubs = answers.clubActivities
      .map((clubKey: string) => answerMappings.clubActivities[clubKey as keyof typeof answerMappings.clubActivities])
      .filter(Boolean);
      
    if (interestedClubs.length > 0) {
      if (interestedClubs.includes('特に参加予定はない') && interestedClubs.length > 1) {
        // 「特になし」と他の選択肢が同時にある場合は、「特になし」を除外
        const filteredClubs = interestedClubs.filter((c: string) => c !== '特に参加予定はない');
        parts.push(`部活動は「${filteredClubs.join('、')}」に興味がある`);
      } else {
        parts.push(`部活動は「${interestedClubs.join('、')}」に興味がある`);
      }
    }
  }
  
  return parts.length > 0 ? parts.join('。') + '。' : '';
}
// --- ヘルパーここまで ---

// --- AIレスポンスからJSONを抽出するユーティリティ ---
function extractJsonFromText(text: string): any {
  // 1. そのまま JSON としてパースを試みる
  try {
    return JSON.parse(text);
  } catch (_) {
    // 続行
  }

  // 2. ```json ... ``` のコードフェンスを探す
  const fenceMatch = text.match(/```json[\s\S]*?({[\s\S]*})[\s\S]*?```/i);
  if (fenceMatch && fenceMatch[1]) {
    try {
      return JSON.parse(fenceMatch[1]);
    } catch (_) {
      // 続行
    }
  }

  // 3. 最初の { と最後の } で囲まれた部分を抽出
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const possibleJson = text.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(possibleJson);
    } catch (_) {
      // fallthrough
    }
  }

  // ここまでで失敗した場合はエラーを投げる
  throw new Error("AIレスポンスからJSONを抽出できませんでした。");
}
// --- ここまでユーティリティ ---

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers, freeformText, grade } = body;

    let userRequestText = freeformText.trim();
    if (!userRequestText) {
      userRequestText = convertAnswersToText(answers, grade);
    }
    
    if (!userRequestText) {
      return NextResponse.json({ error: '入力データが不足しています。' }, { status: 400 });
    }

    console.log("ユーザーの希望 (AIへの入力):", userRequestText);

    // 1. DBから全高専の要約を取得
    const db = await getDb();
    // 英語の要約を読み込む
    const summaries = await db.collection('kosen_summaries').find({}).toArray(); 
    
    // if (summaries.length === 0) {
    //   return NextResponse.json({ error: '要約データが見つかりません。事前にバッチ処理を実行してください。' }, { status: 500 });
    // }

    const kosenDataMap = new Map(summaries.map(s => [s.kosenId, s.summary]));

    // 2. AIに渡すための高専情報テキストを生成
    const kosenInfoForAI = kosenList.map(kosen => {
      const staticInfo = kosen.detailedDescription || '';
      const dynamicSummary = kosenDataMap.get(kosen.id) || '';
      const location = kosen.region || '';
      const departments = kosen.departments?.join('、') || '';
      return `
---
高専ID: ${kosen.id}
高専名: ${kosen.name}
地域: ${location}
学科: ${departments}
概要: ${staticInfo}
体験談からの特徴: ${dynamicSummary}
---
      `.trim();
    }).join('\n');

    // 3. AIへのプロンプトを更新
    const systemPrompt = `あなたは日本の高等専門学校（高専）に非常に詳しいキャリアアドバイザーです。ユーザーの希望に最も合う高専を、提供された情報リストの中から選び、上位3件を提案してください。

# 評価基準
- 興味分野と学科の一致度
- **学力との適合性（最重要）**: ユーザーの学年と偏差値を考慮して、学力的な観点から高専を評価してください。
  - **中学1年生の場合**: 偏差値はまだ変動が大きいため、参考程度とし、本人の興味や将来の希望をより重視してください。偏差値が多少足りなくても、興味が強ければ候補として提案してください。
  - **中学2年生の場合**: 現在の偏差値に+10程度の範囲までを挑戦可能な目標として考慮してください。本人のやる気や今後の伸びしろを評価に含めてください。
  - **中学3年生の場合**: 現在の偏差値に+5程度の範囲までを現実的な目標として考慮してください。これ以上の差がある高専は、よほど強い理由がない限り推奨を控えてください。
  - 上記を踏まえ、ユーザーの偏差値と、あなたがWeb検索で得た高専の最新の入試難易度・偏差値目安・傾斜配点を比較し、学力的に無理なく合格を目指せるかを最優先で考慮してください。
- 教科の得意・不得意と学習内容の相性
- 希望する生活スタイルとの適合性
- 立地条件（都市部/郊外/地方など）
- 部活動や課外活動の充実度
- その他ユーザーが重視している要素

# 追加能力
- 各高専を評価する際、あなたは必ずWeb検索機能を使って、その高専の**最新の入試難易度、偏差値の目安、傾斜配点の情報**を調査しなければなりません。
- 提供された高専情報リストだけでは判断が難しい場合も、Web検索を積極的に使用してください。

# 制約条件
- 提供された情報と、必要に応じて検索して得た情報を基に、最も関連性の高いものを3つ選んでください。
- 回答は必ず指定したJSON形式で出力してください。
- 各高専のマッチ度を1から100の数値で評価してください。
- **マッチする理由**: ユーザーの希望と高専情報のどの点が合致しているかを、**学力的な観点を含めて**、具体的かつ簡潔な「日本語の一文」で記述してください。例：「あなたの興味と学科内容が一致しており、学力的にも挑戦可能なレベルです。」
- もしリスト内に適切な高専が見つからない場合でも、最も近いと思われるものを提案してください。
- ユーザーのことはあなたと出力してください。
- 首都圏以外の高専も均等に検討するようにしてください。

# 出力形式 (JSON)
\`\`\`json
{
  "results": [
    {
      "kosenId": "（高専のID）",
      "matchRate": （マッチ度）,
      "matchReason": "（日本語で記述された、おすすめ理由の一文）"
    }
  ]
}
\`\`\`
`;
    
    const userPrompt = `
以下のユーザーの希望に最も合致する高専を、下記の高専情報リストから選んでください。

# ユーザーの希望
${userRequestText}

# 高専情報リスト
${kosenInfoForAI}
`;

    // 4. AIに問い合わせ (Gemini Native SDKを使用)
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set.');
    }
    console.log("AIへの問い合わせを開始します...");
    console.log("System Prompt Length:", systemPrompt.length);
    console.log("User Prompt Length:", userPrompt.length);

    const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const tools = [
      {
        // Google Search grounding ツール
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        googleSearch: {},
      } as any,
    ];

    const config = {
      tools,
      generationConfig: {
        responseMimeType: "application/json",
      },
    } as any;

    const prompt = `${systemPrompt}\n\n${userPrompt}`;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const result = await (genAI as any).models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config,
    });

    const responseText = (result as any).text ?? (result as any).response?.text?.() ?? "";
    
    let aiResponse;
    try {
      if (!responseText) {
        throw new Error("AIからの応答が空です。");
      }
      aiResponse = extractJsonFromText(responseText);
    } catch(e) {
      console.error("AIからのJSON抽出に失敗しました。", responseText);
      throw new Error("AIからの応答を解析できませんでした。");
    }

    console.log("AIからの応答:", aiResponse);
    
    // 5. AIのレスポンスと元の高専情報をマージ
    const diagnosisResults = aiResponse.results.map((result: any) => {
        const kosen: Kosen | undefined = kosenList.find(k => k.id === result.kosenId);
        if (!kosen) return null;
        return {
            ...kosen,
            location: kosen.region,
            matchRate: result.matchRate,
            matchReason: result.matchReason,
        };
    }).filter(Boolean);

    return NextResponse.json(diagnosisResults);

  } catch (error) {
    console.error('診断APIエラー:', error);
    const errorMessage = error instanceof Error ? error.message : '診断中に不明なエラーが発生しました。';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 