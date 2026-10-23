// Server-side API access. API_URL falls back to NEXT_PUBLIC_API_URL for existing deployments.
export const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
export const API_TAG = 'api';

/** Fetch JSON from the backend (cached, revalidated on CMS writes). Throws on non-2xx. */
export async function apiGet<T = unknown>(path: string, { revalidate = 300 }: { revalidate?: number } = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate, tags: [API_TAG] } });
  if (!res.ok) throw new Error(`API ${path} failed with ${res.status}`);
  return res.json();
}

/** Uncached variant for the CMS so editors always see fresh data. */
export async function apiGetFresh<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API ${path} failed with ${res.status}`);
  return res.json();
}
