"use client";
import "@/components/minimal-tiptap/styles/index.css";

import { EditorContent } from "@tiptap/react";
import { JSONContent } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { useMinimalTiptapEditor } from "@/components/minimal-tiptap/hooks/use-minimal-tiptap";

export const BlogContentRenderer = ({ content }: { content: JSONContent }) => {
  const editor = useMinimalTiptapEditor({
    value: content,
    editable: false,
    editorProps: {
      attributes: {
        class: cn("focus:outline-none", "prose dark:prose-invert max-w-full")
      }
    }
  });

  if (!editor) return null;

  return (
    <EditorContent
      editor={editor}
      className={cn(
        "minimal-tiptap-editor",
        "p-5 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input"
      )}
    />
  );
};
