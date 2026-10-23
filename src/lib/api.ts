// Server-side API access. API_URL falls back to NEXT_PUBLIC_API_URL for existing deployments.
export const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
export const API_TAG = 'api';

export class ApiError extends Error {
  constructor(public status: number, path: string) {
    super(`API ${path} failed with ${status}`);
  }
}

async function parse<T>(res: Response, path: string): Promise<T> {
  if (!res.ok) throw new ApiError(res.status, path);
  return res.json();
}

/** Fetch JSON from the backend (cached, revalidated on CMS writes). Throws ApiError on non-2xx. */
export async function apiGet<T = unknown>(path: string, { revalidate = 300 }: { revalidate?: number } = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate, tags: [API_TAG] } });
  return parse<T>(res, path);
}

/** Uncached variant for the CMS so editors always see fresh data. */
export async function apiGetFresh<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
  return parse<T>(res, path);
}

/** Uncached, authenticated read for admin-only endpoints. Server components under /cms only. */
export async function apiGetAdmin<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${process.env.BACKEND_ADMIN_KEY}` },
  });
  return parse<T>(res, path);
}

export const isNotFound = (err: unknown) => err instanceof ApiError && err.status === 404;
