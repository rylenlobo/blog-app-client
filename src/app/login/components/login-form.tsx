"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { loginSchema } from "../schemas/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "@/components/ui/password-input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useEffect } from "react";

export type LoginInput = z.infer<typeof loginSchema>;

export function LoginForm({ className }: { className?: string }) {
  const { login, isLoggingIn, loginError } = useAuth();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onTouched"
  });

  const { formState } = form;
  const isSubmitting = isLoggingIn || formState.isSubmitting;

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    try {
      await login(data);
    } catch (error) {
      toast.error("Login failed", {
        description:
          error instanceof Error
            ? error.message
            : "Please check your credentials and try again."
      });
    }
  };

  // Show error from auth context
  useEffect(() => {
    if (loginError) {
      toast.error("Login failed", {
        description:
          loginError instanceof Error
            ? loginError.message
            : "Please check your credentials and try again."
      });
    }
  }, [loginError]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="m@example.com"
                    {...field}
                    disabled={isSubmitting}
                    autoFocus
                    inputMode="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    placeholder="password"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={!formState.isValid || isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign In"}
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}
