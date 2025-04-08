"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner"; // Optional toast lib

interface DeletePostButtonProps {
  postId: string;
  onSuccess?: () => void;
}

export default function DeletePostButton({
  postId,
  onSuccess
}: DeletePostButtonProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await api.delete(`/blog/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      toast.success("Post deleted successfully.");
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete the post. Try again.");
    }
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    mutate();
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Confirm"}
    </Button>
  );
}
