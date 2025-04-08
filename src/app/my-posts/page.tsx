"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/lib/api";
import DeletePostButton from "./components/DeletePostButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface BlogPost {
  _id: string;
  title: string;
  summary: string;
  authorId: { firstName: string; lastName: string };
  createdAt: string;
}

export default function MyPostsPage() {
  const {
    data: posts = [],
    isLoading,
    error
  } = useQuery<BlogPost[]>({
    queryKey: ["my-posts"],
    queryFn: async () => {
      const response = await api.get("/blog/myposts");
      return response.data;
    }
  });

  const [openDialogPostId, setOpenDialogPostId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load posts. Please try again later.
      </p>
    );
  }

  return (
    <div className="pt-22 p-4 grid gap-3">
      {posts.length === 0 ? (
        <p className="text-center mt-10">You have no blog posts.</p>
      ) : (
        posts.map(({ _id, title, summary, authorId, createdAt }) => (
          <Card
            key={_id}
            className="group w-full max-w-xl mx-auto rounded-sm shadow-xs border-1 border-border px-0 pb-0 bg-background"
          >
            <CardContent className="flex flex-col gap-2 px-0 group-hover:shadow-sm transition duration-200 ease-in-out">
              <div className="px-5">
                <div className="text-sm flex flex-col sm:flex-row sm:justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold">
                      {title}
                    </h2>
                    <span className="text-sm font-semibold text-muted-foreground">
                      By {authorId.firstName} {authorId.lastName}
                    </span>
                  </div>
                  <span className="text-muted-foreground mt-2 md:mt-0 text-xs md:text-sm">
                    {new Date(createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                  {summary}
                </p>
              </div>

              <div className="flex gap-2 items-center justify-end border-t-1 px-5 py-3">
                <Link href={`/edit-post/${_id}`}>
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                </Link>

                <AlertDialog
                  open={openDialogPostId === _id}
                  onOpenChange={(isOpen) =>
                    setOpenDialogPostId(isOpen ? _id : null)
                  }
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setOpenDialogPostId(_id)}
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your blog post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setOpenDialogPostId(null)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <DeletePostButton
                          postId={_id}
                          onSuccess={() => setOpenDialogPostId(null)}
                        />
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
