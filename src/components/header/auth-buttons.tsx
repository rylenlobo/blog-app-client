"use client";
import React from "react";
import { LogOut, Menu, Newspaper, Plus, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";

export default function AuthButtons() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <li className="space-x-3">
        <Button asChild>
          <Link href="login">Login</Link>
        </Button>

        <Button asChild variant="outline">
          <Link href="signup">Sign Up</Link>
        </Button>
      </li>
    );
  }

  return (
    <li className="relative">
      {/* Mobile Dropdown */}
      <div className="">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 p-0 text-sm">
            {/* Greeting */}
            <DropdownMenuItem
              disabled
              className="flex items-center gap-2 border-b px-4 py-3 font-medium "
            >
              <User className="h-4 w-4" />
              Hello, {user.firstName} {user.lastName}
            </DropdownMenuItem>

            <div className="p-1">
              {/* My Posts */}
              <DropdownMenuItem className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                <Link href="my-posts"> My Posts</Link>
              </DropdownMenuItem>

              {/* Create Post */}
              <DropdownMenuItem className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <Link href="/create-post" className="w-full">
                  Create Post
                </Link>
              </DropdownMenuItem>

              {/* Logout */}
              <DropdownMenuItem
                onClick={logout}
                className="flex items-center gap-2 "
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}
