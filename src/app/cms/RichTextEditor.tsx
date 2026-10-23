"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

function ToolbarButton({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`px-2 py-1 text-xs rounded transition-all duration-100 ${
        active
          ? "bg-accent bg-opacity-30 text-accent"
          : "text-fg opacity-60 hover:opacity-100 hover:bg-accent hover:bg-opacity-10"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ name, defaultValue = "" }: { name: string; defaultValue?: string }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[120px] px-3 py-2 text-sm text-fg focus:outline-none",
      },
    },
  });

  // Reset content when defaultValue changes (e.g. opening a different item)
  useEffect(() => {
    if (editor && editor.getHTML() !== defaultValue) {
      editor.commands.setContent(defaultValue || "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const html = editor ? editor.getHTML() : defaultValue;

  return (
    <div className="border border-accent border-opacity-20 rounded focus-within:border-opacity-60 transition-all duration-150">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 px-2 py-1 border-b border-accent border-opacity-20">
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          active={editor?.isActive("bold")}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          active={editor?.isActive("italic")}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          active={editor?.isActive("strike")}
        >
          S
        </ToolbarButton>
        <span className="w-px bg-accent bg-opacity-20 mx-1" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive("bulletList")}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          active={editor?.isActive("orderedList")}
        >
          1. List
        </ToolbarButton>
        <span className="w-px bg-accent bg-opacity-20 mx-1" />
        <ToolbarButton
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor?.isActive("heading", { level: 3 })}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().setParagraph().run()}
          active={editor?.isActive("paragraph")}
        >
          P
        </ToolbarButton>
        <span className="w-px bg-accent bg-opacity-20 mx-1" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().undo().run()}
          active={false}
        >
          ↩
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().redo().run()}
          active={false}
        >
          ↪
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Hidden input to carry value through FormData */}
      <input type="hidden" name={name} value={html} readOnly />
    </div>
  );
}
