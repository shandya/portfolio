import type { MetadataRoute } from 'next';
import { apiGet } from '@/lib/api';
import { SITE_URL } from '@/lib/site';
import type { ApiList, PostSummary } from '@/types';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/archive`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
  ];

  try {
    const { data } = await apiGet<ApiList<PostSummary>>('/posts?size=100');
    return [
      ...pages,
      ...data.map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.updated_at,
        changeFrequency: 'yearly' as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return pages; // still serve the static pages if the API is down
  }
}
