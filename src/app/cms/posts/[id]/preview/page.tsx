import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import PostArticle from '@/app/components/PostArticle';
import { apiGetAdmin, isNotFound } from '@/lib/api';
import { formatDate } from '@/lib/site';
import type { Post } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Preview',
  robots: { index: false, follow: false },
};

export default async function PostPreviewPage({ params }: { params: { id: string } }) {
  if (!/^\d+$/.test(params.id)) notFound();

  let post: Post;
  try {
    post = (await apiGetAdmin<{ data: Post }>(`/posts/${params.id}`)).data;
  } catch (err) {
    if (isNotFound(err)) notFound();
    throw err;
  }

  const isDraft = post.status === 'draft';

  return (
    <div>
      <div
        role="status"
        className={`mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
          isDraft
            ? 'border-yellow-400 border-opacity-40 bg-yellow-400 bg-opacity-10 text-yellow-200'
            : 'border-accent border-opacity-30 bg-accent bg-opacity-10 text-accent'
        }`}
      >
        <span>
          {isDraft
            ? 'Preview — this draft is not visible to the public.'
            : `Preview — published ${formatDate(post.published_at)}.`}{' '}
          <span className="opacity-60">Last saved {formatDate(post.updated_at)}</span>
        </span>
        <span className="flex gap-4">
          <Link href="/cms/posts" className="underline underline-offset-2">
            Back to posts
          </Link>
          {!isDraft && (
            <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="underline underline-offset-2">
              Open live page ↗
            </a>
          )}
        </span>
      </div>

      <article className="max-w-screen-md mx-auto w-full">
        {post.excerpt && <p className="text-sm text-fg opacity-50 italic">Excerpt: {post.excerpt}</p>}
        <PostArticle post={post} />
      </article>
    </div>
  );
}
