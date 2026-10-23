import Link from 'next/link';
import { apiGetAdmin } from '@/lib/api';
import type { Post } from '@/types';

export const dynamic = 'force-dynamic';

export default async function CmsDashboardPage() {
  let posts: Post[] | null = null;
  try {
    posts = (await apiGetAdmin<{ data: Post[] }>('/posts/admin')).data;
  } catch {
    posts = null;
  }
  const published = posts?.filter((p) => p.status === 'published').length ?? 0;
  const drafts = posts ? posts.length - published : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-accent opacity-80 mb-2">Dashboard</h1>
      <p className="text-fg opacity-60 mb-8">Hello, welcome to CMS.</p>

      <Link
        href="/cms/posts"
        className="inline-flex gap-8 border border-accent border-opacity-20 rounded-lg px-6 py-4 hover:border-opacity-60 transition-all duration-150"
      >
        {posts === null ? (
          <span className="text-sm text-fg opacity-60">Posts unavailable</span>
        ) : (
          <>
            <span>
              <span className="block text-2xl text-accent">{published}</span>
              <span className="text-xs text-fg opacity-60">Published posts</span>
            </span>
            <span>
              <span className="block text-2xl text-accent">{drafts}</span>
              <span className="text-xs text-fg opacity-60">Drafts</span>
            </span>
          </>
        )}
      </Link>
    </div>
  );
}
