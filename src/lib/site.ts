export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const SITE_NAME = 'Shandy Ardiansyah';
export const SITE_DESCRIPTION =
  'Frontend Developer with ten years of experience building websites in the tech & creative advertising industries.';

export const SOCIAL_LINKS = [
  'https://x.com/shandya',
  'https://instagram.com/shandya',
  'https://www.linkedin.com/in/shandya',
];

/** Estimated minutes to read an HTML string at ~200 words per minute (minimum 1). */
export function readingTime(html: string): number {
  const words = html
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** "2026-10-23T05:00:00Z" -> "Oct 23, 2026" */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export const splitTags = (tags: string) =>
  tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
