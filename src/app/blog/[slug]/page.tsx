import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import type { Metadata } from 'next';

import Gradient from '@/app/components/Gradient';
import JsonLd from '@/app/components/JsonLd';
import PostArticle from '@/app/components/PostArticle';
import { apiGet, isNotFound } from '@/lib/api';
import { SITE_NAME, SITE_URL, splitTags } from '@/lib/site';
import type { ApiList, Post, PostSummary } from '@/types';

type Props = { params: { slug: string } };

// Shared between generateMetadata and the page (one request per render)
const getPost = cache(async (slug: string): Promise<Post | null> => {
  try {
    const { data } = await apiGet<{ data: Post }>(`/posts/slug/${encodeURIComponent(slug)}`);
    return data;
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
});

// Pre-render recent posts at build; others render on first request (ISR)
export async function generateStaticParams() {
  try {
    const { data } = await apiGet<ApiList<PostSummary>>('/posts?size=20');
    return data.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post not found' };

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt || undefined,
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      tags: splitTags(post.tags),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const tags = splitTags(post.tags);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-10 md:py-16 lg:py-24">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.published_at,
          dateModified: post.updated_at,
          url: `${SITE_URL}/blog/${post.slug}`,
          image: `${SITE_URL}/blog/${post.slug}/opengraph-image`,
          keywords: tags.join(', '),
          author: { '@type': 'Person', name: SITE_NAME, url: SITE_URL },
        }}
      />

      <article className="px-4 max-w-screen-md relative z-10 w-full">
        <Link href="/blog" className="text-sm text-fg opacity-60 hover:opacity-100">← All posts</Link>

        <PostArticle post={post} />

        <footer className="py-10 mt-10 border-t border-slate-300 border-opacity-30">
          <Link href="/blog" className="inline-block text-fg">← Back to all posts</Link>
        </footer>
      </article>

      <Gradient />
    </main>
  );
}
