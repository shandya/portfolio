export interface Work {
  id: number;
  title: string;
  company_name: string;
  location: string;
  time: string;
  job_desc: string;
}

export interface PortfolioItem {
  id: number;
  name: string;
  tags: string;
  external_url: string;
  description: string;
  year: string;
  highlight: boolean;
  client: string;
  made_at: string;
}

export interface PageMeta {
  currentPage: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiList<T> {
  data: T[];
  meta: PageMeta;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export type PostStatus = 'draft' | 'published';

export interface PostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_url: string;
  tags: string;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post extends PostSummary {
  content: string;
}
