import { formatDate, readingTime, splitTags } from '@/lib/site';
import type { Post } from '@/types';

/** The rendered body of a blog post. Shared by the public post page and the CMS preview. */
export default function PostArticle({ post }: { post: Post }) {
  const tags = splitTags(post.tags);

  return (
    <>
      <header className="mt-6 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-accent leading-tight">{post.title}</h1>
        <p className="mt-3 text-sm text-fg opacity-60">
          {post.published_at ? (
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          ) : (
            <span>Not published yet</span>
          )}
          {' · '}
          {readingTime(post.content)} min read
        </p>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="text-accent py-1 px-3 bg-opacity-30 bg-accent rounded-3xl text-[0.7em]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose prose-invert max-w-none prose-p:text-fg prose-li:text-fg prose-strong:text-fg prose-blockquote:text-fg prose-headings:text-accent prose-a:text-accent prose-code:text-accent prose-pre:bg-black prose-pre:bg-opacity-40"
        // content is sanitized by the backend (sanitize-html) on write
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </>
  );
}
