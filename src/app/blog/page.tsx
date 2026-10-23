import Link from 'next/link';
import type { Metadata } from 'next';

import Gradient from '@/app/components/Gradient';
import { apiGet } from '@/lib/api';
import { formatDate, splitTags } from '@/lib/site';
import type { ApiList, PostSummary } from '@/types';

const PAGE_SIZE = 10;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on frontend development, tooling and building for the web.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, Number(searchParams.page) || 1);

  let result: ApiList<PostSummary> | null = null;
  try {
    result = await apiGet<ApiList<PostSummary>>(`/posts?page=${page}&size=${PAGE_SIZE}`);
  } catch {
    result = null;
  }

  const posts = result?.data ?? [];
  const meta = result?.meta;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-10 md:py-16 lg:py-24">
      <section className="px-4 max-w-screen-md relative z-10 w-full">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-accent opacity-60">Blog</h1>
          <p className="mt-2 text-sm text-fg opacity-60">
            Notes on frontend development, tooling and building for the web.{' '}
            <a href="/blog/rss.xml" className="underline underline-offset-4 hover:opacity-100">RSS</a>
          </p>
        </header>

        {result === null ? (
          <p className="py-16 text-center text-fg opacity-60">Posts could not be loaded. Please try again in a moment.</p>
        ) : posts.length === 0 ? (
          <p className="py-16 text-center text-fg opacity-60">No posts yet. Check back soon.</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id} className="border-b border-slate-300 border-opacity-30">
                <Link
                  href={`/blog/${post.slug}`}
                  className="block py-6 opacity-70 hover:opacity-100 ease-in transition-all duration-150"
                >
                  <p className="text-xs text-fg mb-2">{formatDate(post.published_at)}</p>
                  <h2 className="text-lg font-semibold text-accent leading-tight">{post.title}</h2>
                  {post.excerpt && <p className="mt-2 text-sm text-fg">{post.excerpt}</p>}
                  {post.tags && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {splitTags(post.tags).map((tag) => (
                        <span key={tag} className="text-accent py-1 px-3 bg-opacity-30 bg-accent rounded-3xl text-[0.7em]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {meta && meta.totalPages > 1 && (
          <nav className="mt-8 flex justify-between text-sm text-fg" aria-label="Pagination">
            {page > 1 ? <Link href={`/blog?page=${page - 1}`}>← Newer</Link> : <span />}
            {page < meta.totalPages ? <Link href={`/blog?page=${page + 1}`}>Older →</Link> : <span />}
          </nav>
        )}

        <footer className="py-10">
          <Link href="/" className="inline-block text-fg">Back to home</Link>
        </footer>
      </section>

      <Gradient />
    </main>
  );
}
