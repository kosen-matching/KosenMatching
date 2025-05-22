'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

interface FormData {
  kosenName: string;
  departmentName: string;
  status: string; // 例: 卒業 (2020年卒), 在学中 (3年生)
  curriculumReview: string;
  studentLifeReview: string;
  careerReview: string;
  entranceExamLevel: string;
  otherComments: string;
  // disclosurePreference: string; // 今回はUIに含めず
}

export default function CollectInfoForm() {
  const [formData, setFormData] = useState<FormData>({
    kosenName: '',
    departmentName: '',
    status: '',
    curriculumReview: '',
    studentLifeReview: '',
    careerReview: '',
    entranceExamLevel: '',
    otherComments: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('収集データ:', formData);
    alert('情報が送信されました（コンソールを確認してください）');
    // Reset form after submission
    setFormData({
      kosenName: '',
      departmentName: '',
      status: '',
      curriculumReview: '',
      studentLifeReview: '',
      careerReview: '',
      entranceExamLevel: '',
      otherComments: '',
    });
  };

  return (
    <Card className="w-full elegant-card">
      <CardHeader>
        <CardTitle>情報入力</CardTitle>
        <CardDescription>高専に関するあなたの経験や情報を教えてください。</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="kosenName" className="block text-sm font-medium">
              高専名 <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="kosenName"
              id="kosenName"
              value={formData.kosenName}
              onChange={handleChange}
              placeholder="例：〇〇工業高等専門学校"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="departmentName" className="block text-sm font-medium">
              学科名 <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="departmentName"
              id="departmentName"
              value={formData.departmentName}
              onChange={handleChange}
              placeholder="例：情報工学科"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium">
              卒業年度または在籍学年 <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="例: 2020年卒, 3年生"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="entranceExamLevel" className="block text-sm font-medium">
              入試に必要な学力レベル
            </label>
            <Textarea
              name="entranceExamLevel"
              id="entranceExamLevel"
              value={formData.entranceExamLevel}
              onChange={handleChange}
              placeholder="例: 定期テストで5教科合計400点以上、数学と理科が得意であること等"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="curriculumReview" className="block text-sm font-medium">
              カリキュラムに関する評価・コメント
            </label>
            <Textarea
              name="curriculumReview"
              id="curriculumReview"
              value={formData.curriculumReview}
              onChange={handleChange}
              placeholder="例：専門科目が充実していた、実験が多く実践的だったなど"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="studentLifeReview" className="block text-sm font-medium">
              学生生活（部活動、寮生活など）に関する情報
            </label>
            <Textarea
              name="studentLifeReview"
              id="studentLifeReview"
              value={formData.studentLifeReview}
              onChange={handleChange}
              placeholder="例：〇〇部が強かった、寮生活は楽しかった、学園祭が盛り上がったなど"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="careerReview" className="block text-sm font-medium">
              就職活動や進学に関する情報
            </label>
            <Textarea
              name="careerReview"
              id="careerReview"
              value={formData.careerReview}
              onChange={handleChange}
              placeholder="例：〇〇大学に編入した、〇〇株式会社に就職した、学校のサポートが手厚かったなど"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="otherComments" className="block text-sm font-medium">
              その他、自由記述の意見やアドバイス
            </label>
            <Textarea
              name="otherComments"
              id="otherComments"
              value={formData.otherComments}
              onChange={handleChange}
              placeholder="高専を目指す後輩へのメッセージなど、ご自由にお書きください"
              rows={4}
            />
          </div>

          <CardFooter className="p-0 pt-6">
            <Button type="submit" className="w-full bg-theme-primary hover:bg-theme-primary/90 text-white elegant-button">
              送信する
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
} 