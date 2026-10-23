import { ImageResponse } from 'next/og';
import OgCard, { OG_SIZE } from '@/app/components/OgCard';
import { apiGet } from '@/lib/api';
import { SITE_NAME, formatDate, readingTime } from '@/lib/site';
import type { Post } from '@/types';

export const alt = 'Blog post';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const runtime = 'edge';

export default async function Image({ params }: { params: { slug: string } }) {
  let post: Post | null = null;
  try {
    post = (await apiGet<{ data: Post }>(`/posts/slug/${encodeURIComponent(params.slug)}`)).data;
  } catch {
    post = null;
  }

  return new ImageResponse(
    post ? (
      <OgCard
        eyebrow={`${SITE_NAME} · Blog`}
        title={post.title}
        footer={`${formatDate(post.published_at)} · ${readingTime(post.content)} min read`}
      />
    ) : (
      <OgCard eyebrow={SITE_NAME} title="Blog" footer="Notes on frontend development" />
    ),
    size,
  );
}
