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
