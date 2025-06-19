export interface Kosen {
  id: string;
  name: string;
  location: string;
  website: string;
  type: '国立' | '公立' | '私立';
  departments?: string[];
  description?: string;
  imageUrl?: string;
  imageCreditText?: string;
  imageCreditUrl?: string;
} 