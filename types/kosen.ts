export interface Kosen {
  id: string;
  name: string;
  yomi: string;
  type: '国立' | '公立' | '私立';
  campus: string;
  region: string;
  website: string;
  departments: string[];
  description: string;
  detailedDescription?: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  imageCreditText?: string;
  imageCreditUrl?: string;
}