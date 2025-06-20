import { NextResponse } from 'next/server';
import { kosenList } from '@/lib/kosen-data';
import type { Kosen } from '@/types/kosen';

// 診断結果にマッチ度を追加するための新しい型
interface DiagnosisResult extends Kosen {
  matchRate: number;
  matchReason: string;
}

// 興味分野と学科名の関連付け
const interestDepartmentMap: Record<string, string[]> = {
  mechanical: ['機械'],
  electrical: ['電気', '電子'],
  information: ['情報', 'コンピュータ', 'ネットワーク', 'メディア'],
  chemical: ['化学', '生物', '物質', '環境'],
  architecture: ['建築', '土木', '都市', 'デザイン'],
  marine: ['商船', '海洋'],
};

// 得意科目と分野の関連付け
const subjectInterestMap: Record<string, string[]> = {
  math: ['mechanical', 'electrical', 'information'],
  physics: ['mechanical', 'electrical'],
  chemistry: ['chemical'],
  biology: ['chemical'],
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers, freeformText } = body;

    if (!answers) {
      return NextResponse.json({ error: '回答データがありません。' }, { status: 400 });
    }

    const diagnosisResults: DiagnosisResult[] = kosenList.map(kosen => {
      let score = 50; // ベーススコア
      let reason = 'あなたの希望に近い可能性がある高専です。';
      const reasonDetails: string[] = [];

      // 興味分野に基づくスコアリング
      if (answers.interests && interestDepartmentMap[answers.interests] && kosen.departments) {
        const keywords = interestDepartmentMap[answers.interests];
        const hasMatchingDept = kosen.departments.some(dept => 
          keywords.some(keyword => dept.includes(keyword))
        );
        if (hasMatchingDept) {
          score += 25;
          reasonDetails.push(`興味分野「${answers.interests}」にマッチしています。`);
        }
      }
      
      // 得意科目に紐づく興味分野へのスコアリング
      if (answers.subjects && subjectInterestMap[answers.subjects]) {
        const interestedFields = subjectInterestMap[answers.subjects];
        if (interestedFields.includes(answers.interests)) {
            score += 15;
            reasonDetails.push(`得意科目「${answers.subjects}」が興味分野と関連しています。`);
        }
      }

      // 将来やりたいことによるスコアリング
      if(answers.future) {
        if(answers.future === 'engineer' || answers.future === 'creative'){
            score += 5;
        }
        if(answers.future === 'researcher') {
            score += 5;
        }
      }

      // 性格によるスコアリング
      if(answers.personality){
        if(answers.personality === 'logical' && (answers.interests === 'information' || answers.interests === 'electrical')){
            score += 10;
        }
         if(answers.personality === 'practical' && (answers.interests === 'mechanical' || answers.interests === 'architecture')){
            score += 10;
        }
      }

      // 希望する環境によるスコアリング
      if(answers.environment) {
          if (answers.environment.dormitory > 70) score += 5;
          if (answers.environment.international > 70) score += 5;
      }
      
      // スコアを100に丸める
      const matchRate = Math.min(Math.round(score), 100);
      
      if(reasonDetails.length > 0) {
        reason = reasonDetails.join(' ');
      }

      return {
        ...kosen,
        matchRate,
        matchReason: reason,
        // APIのレスポンスに含めるデータを絞る場合はここで選択
        // 例: id, name, location, departments, imageUrl, matchRate, matchReason のみ返す
      };
    })
    .sort((a, b) => b.matchRate - a.matchRate) // マッチ度で降順ソート
    .slice(0, 5); // 上位5件を返す

    return NextResponse.json(diagnosisResults);

  } catch (error) {
    console.error('診断APIエラー:', error);
    return NextResponse.json({ error: '診断中にエラーが発生しました。' }, { status: 500 });
  }
} 