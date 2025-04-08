"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MinimalTiptapEditor,
  TiptapDocumentSchema
} from "@/components/minimal-tiptap";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  content: TiptapDocumentSchema
});

type FormValues = z.infer<typeof formSchema>;

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const postId = params.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: {}
    }
  });

  const { data: post, isLoading: loadingPost } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await api.get(`/blog/posts/${postId}`);
      return response.data;
    },
    enabled: !!postId
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        summary: post.summary,
        content: post.content
      });
    }
  }, [post]);

  const updatePostMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await api.put(`/blog/edit-post/${postId}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Post updated successfully!");
      router.push("/");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to update post: ${errorMessage}`);
    }
  });

  const onSubmit = (values: FormValues) => {
    updatePostMutation.mutate(values);
  };

  if (loadingPost) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-22 mx-auto px-5 lg:max-w-3xl h-[calc(100dvh-2rem)]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Title"
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Summary</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Summary"
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <MinimalTiptapEditor
                    {...field}
                    output="json"
                    className="bg-white"
                    placeholder="Write your content here..."
                    editorContentClassName="p-5 min-h-[calc(100dvh-20rem)]"
                    editable={!updatePostMutation.isPending}
                    throttleDelay={4000}
                    shouldRerenderOnTransaction={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={updatePostMutation.isPending}
            className="w-full"
          >
            {updatePostMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Post"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
