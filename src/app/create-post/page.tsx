"use client";

import {
  MinimalTiptapEditor,
  TiptapDocumentSchema
} from "@/components/minimal-tiptap";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { JSONContent } from "@tiptap/react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  content: TiptapDocumentSchema
});

type FormValues = z.infer<typeof formSchema>;

const CreatePostPage = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      summary: "",
      content: {}
    }
  });

  const router = useRouter();

  const createPostMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      summary: string;
      content: JSONContent;
    }) => {
      const response = await api.post("/blog/posts", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Post published successfully!", {
        position: "top-center"
      });
      form.reset();
      router.push("/");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to publish post: ${errorMessage}`);
    }
  });

  const onSubmit = (values: FormValues) => {
    createPostMutation.mutate({
      title: values.title,
      summary: values.summary,
      content: values.content
    });
  };

  const isSubmitDisabled =
    !form.formState.isValid ||
    Object.keys(form.formState.errors).length > 0 ||
    createPostMutation.isPending;

  return (
    <div className="pt-22 mx-auto px-5 lg:max-w-3xl h-[calc(100dvh-2rem)]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6 pb-5"
        >
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
                    className={cn("w-full bg-background", {
                      "border-destructive focus-visible:ring-0":
                        form.formState.errors.title
                    })}
                    disabled={createPostMutation.isPending}
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
                    placeholder="Write a concise summary of your content"
                    className={cn("w-full bg-background", {
                      "border-destructive focus-visible:ring-0":
                        form.formState.errors.summary
                    })}
                    disabled={createPostMutation.isPending}
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
                    shouldRerenderOnTransaction={false}
                    className={cn(
                      "bg-background w-full rounded-xl transition-[color,box-shadow]",
                      form.formState.errors.content
                        ? "border-destructive focus-within:border-destructive"
                        : "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
                      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                    )}
                    editorContentClassName="p-5 overflow-y-auto min-h-[calc(100dvh-20rem)]"
                    output="json"
                    placeholder="Add your blog content here..."
                    editable={!createPostMutation.isPending}
                    throttleDelay={4000}
                    immediatelyRender={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitDisabled} className="w-full">
            {createPostMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Post"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreatePostPage;
