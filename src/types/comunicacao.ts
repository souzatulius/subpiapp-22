
export interface Release {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  publishDate: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  tags?: string[];
  summary?: string;
  created_at?: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  publishDate: string;
  source: string;
  url?: string;
  tags?: string[];
}

export interface ReleaseSearchParams {
  query: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}
