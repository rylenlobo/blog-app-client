"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { MeasuredContainer } from "@/components/minimal-tiptap/components/measured-container";
import { BlogContentRenderer } from "./components/BlogContentRenderer";
import { cn } from "@/lib/utils";

export default function BlogPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const response = await api.get(`/blog/posts/${id}`);
      return response.data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-full text-red-500 font-medium">
        Error loading blog content.
      </div>
    );
  }

  const { title, authorId, createdAt, content } = data;

  return (
    <div className="pt-24 max-w-4xl mx-auto px-4">
      {/* Blog Title */}
      <h1 className="text-4xl font-bold tracking-tight mb-2">{title}</h1>

      {/* Author and Date */}
      <div className="text-muted-foreground text-sm mb-8">
        By{" "}
        <span className="font-medium">
          {authorId.firstName} {authorId.lastName}
        </span>{" "}
        •{" "}
        {new Date(createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })}
      </div>

      {/* Blog Content */}
      <MeasuredContainer
        as="div"
        name="editor"
        className={cn(
          "mb-10 bg-white overflow-x-auto w-full min-data-[orientation=vertical]:h-72 flex h-auto flex-col rounded-md border shadow-xs"
        )}
      >
        <BlogContentRenderer content={content} />
      </MeasuredContainer>
    </div>
  );
}
