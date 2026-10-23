"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Transition } from "@headlessui/react";
import { createPost, updatePost, deletePost } from "@/app/cms/actions";
import RichTextEditor from "@/app/cms/RichTextEditor";
import { formatDate } from "@/lib/site";
import type { Post } from "@/types";

const TEXT_FIELDS: { name: keyof Post; label: string; required?: boolean; hint?: string }[] = [
  { name: "title", label: "Title", required: true },
  { name: "slug", label: "Slug", hint: "Leave blank to generate from the title" },
  { name: "tags", label: "Tags (comma-separated)" },
  { name: "cover_url", label: "Cover image URL (optional)" },
];

const inputClass =
  "bg-transparent border border-accent border-opacity-20 text-fg text-sm px-3 py-2 rounded focus:outline-none focus:border-opacity-60";

export default function PostsClient({ initialData }: { initialData: Post[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function openAdd() {
    setEditing(null);
    setError("");
    setModalOpen(true);
  }

  function openEdit(item: Post) {
    setEditing(item);
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(formRef.current ?? undefined);
    const result = editing ? await updatePost(editing.id, fd) : await createPost(fd);
    setSaving(false);

    if (!result.ok) {
      setError(result.error || "Something went wrong.");
      return;
    }
    closeModal();
    startTransition(() => router.refresh());
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this post?")) return;
    const result = await deletePost(id);
    if (!result.ok) {
      alert(result.error || "Failed to delete.");
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-accent opacity-80">Posts</h1>
        <button
          onClick={openAdd}
          className="text-sm bg-accent bg-opacity-20 text-accent px-4 py-2 rounded hover:bg-opacity-30 transition-all duration-150"
        >
          + New Post
        </button>
      </div>

      {initialData.length === 0 ? (
        <p className="text-fg opacity-60 text-sm">No posts yet. Write your first one.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-fg opacity-60 border-b border-accent border-opacity-20">
                <th className="py-3 pr-4">Title</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Published</th>
                <th className="py-3 pr-4">Updated</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody>
              {initialData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-accent border-opacity-10 text-fg opacity-70 hover:opacity-100 transition-all duration-150"
                >
                  <td className="py-3 pr-4">
                    <div>{item.title}</div>
                    <div className="text-xs opacity-50">/{item.slug}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`px-2 py-0.5 rounded-3xl text-xs ${
                        item.status === "published"
                          ? "bg-accent bg-opacity-20 text-accent"
                          : "bg-slate-500 bg-opacity-30 text-fg"
                      }`}
                    >
                      {item.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">{formatDate(item.published_at) || "—"}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">{formatDate(item.updated_at)}</td>
                  <td className="py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <a
                        href={`/cms/posts/${item.id}/preview`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent text-xs underline underline-offset-2 opacity-60 hover:opacity-100"
                      >
                        Preview
                      </a>
                      {item.status === "published" && (
                        <a
                          href={`/blog/${item.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent text-xs underline underline-offset-2 opacity-60 hover:opacity-100"
                        >
                          View
                        </a>
                      )}
                      <button
                        onClick={() => openEdit(item)}
                        className="text-accent text-xs underline underline-offset-2 opacity-60 hover:opacity-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 text-xs underline underline-offset-2 opacity-60 hover:opacity-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Transition
        show={modalOpen}
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div onClick={closeModal} className="absolute inset-0 bg-black bg-opacity-60" />
          <div className="relative z-10 bg-gray-900 border border-accent border-opacity-20 rounded-lg w-full max-w-[900px] max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-accent mb-6">{editing ? "Edit Post" : "New Post"}</h2>
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
              {TEXT_FIELDS.map(({ name, label, required, hint }) => (
                <div key={name} className="flex flex-col gap-1">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-fg opacity-60">{label}</span>
                    <input
                      type="text"
                      name={name}
                      defaultValue={String(editing?.[name] ?? "")}
                      required={required}
                      aria-describedby={hint ? `${name}-hint` : undefined}
                      className={inputClass}
                    />
                  </label>
                  {hint && (
                    <span id={`${name}-hint`} className="text-[0.7rem] text-fg opacity-40">
                      {hint}
                    </span>
                  )}
                </div>
              ))}

              <label className="flex flex-col gap-1">
                <span className="text-xs text-fg opacity-60">Excerpt (shown in lists and link previews)</span>
                <textarea
                  name="excerpt"
                  defaultValue={editing?.excerpt ?? ""}
                  rows={2}
                  maxLength={300}
                  className={`${inputClass} resize-y`}
                />
              </label>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-fg opacity-60">Content</span>
                <RichTextEditor name="content" defaultValue={editing?.content ?? ""} />
              </div>

              <label className="flex flex-col gap-1 max-w-xs">
                <span className="text-xs text-fg opacity-60">Status</span>
                <select
                  name="status"
                  defaultValue={editing?.status ?? "draft"}
                  className={`${inputClass} bg-gray-900`}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || isPending}
                  className="flex-1 bg-accent bg-opacity-20 text-accent font-semibold py-2 rounded hover:bg-opacity-30 transition-all duration-150 disabled:opacity-40"
                >
                  {saving || isPending ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-accent border-opacity-20 text-fg py-2 rounded hover:border-opacity-60 transition-all duration-150"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </>
  );
}
