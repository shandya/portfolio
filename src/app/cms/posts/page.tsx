import PostsClient from './PostsClient';
import { apiGetAdmin } from '@/lib/api';
import type { Post } from '@/types';

export const dynamic = 'force-dynamic';

export default async function CmsPostsPage() {
  const json = await apiGetAdmin<{ data: Post[] }>('/posts/admin');
  return <PostsClient initialData={json.data ?? []} />;
}
