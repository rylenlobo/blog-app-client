import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, ArrowRight } from "lucide-react";

// data/blogPosts.ts

export const blogPosts = [
  {
    title: "React Hooks Explained",
    author: "Carol White",
    date: "March 12, 2025",
    summary:
      "A comprehensive guide to React Hooks and how to use them effectively in your projects.",
    likes: 22,
    comments: 10
  },
  {
    title: "Please Start Writing Better Git Commits",
    author: "Travis Aaron Wagner",
    date: "July 29, 2022",
    summary:
      "Learn why clear commit messages matter and how to write ones your team will love.",
    likes: 45,
    comments: 19
  },
  {
    title: "JavaScript Array Methods You Should Know",
    author: "Leah Kim",
    date: "February 15, 2025",
    summary:
      "An overview of powerful JavaScript array methods that can simplify your code.",
    likes: 18,
    comments: 7
  },
  {
    title: "Understanding Flexbox Once and For All",
    author: "Mohit Sharma",
    date: "April 1, 2025",
    summary:
      "Still confused by Flexbox? This visual guide will help it finally click.",
    likes: 34,
    comments: 12
  },
  {
    title: "How to Build a Blog with Next.js and MDX",
    author: "Nina Patel",
    date: "March 30, 2025",
    summary:
      "Step-by-step guide to building a markdown-powered blog using Next.js and MDX.",
    likes: 50,
    comments: 24
  }
];

interface BlogCardProps {
  title: string;
  author: string;
  date: string;
  summary: string;
  likes: number;
  comments: number;
}

function BlogCard({
  title,
  author,
  date,
  summary,
  likes,
  comments
}: BlogCardProps) {
  return (
    <Card className="group w-full max-w-xl mx-auto rounded-sm shadow-xs border-1 border-border  px-0 pb-0 bg-background">
      <CardContent className=" flex flex-col gap-2 px-0 group-hover:shadow-sm transition duration-200 ease-in-out">
        <div className="px-5">
          <div className="text-sm  flex flex-col sm:flex-row sm:justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
              <span className="text-sm font-semibold text-muted-foreground">
                By {author}
              </span>
            </div>
            <span className="text-muted-foreground mt-2 md:mt-0 text-xs md:text-sm">
              {date}
            </span>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mt-3">
            {summary}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 border-t-1 px-5 py-3">
          <div className="flex gap-4 text-sm text-muted-foreground items-center">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {likes}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {comments}
            </div>
          </div>

          {/* Mobile: text link */}
          <span className="sm:hidden text-sm text-blue-600 font-medium">
            Read more
          </span>

          {/* Desktop: button */}
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center text-xs gap-2 rounded-full border-primary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            Read Article
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="pt-22 p-4 grid gap-3">
      {blogPosts.map((post, index) => (
        <BlogCard key={index} {...post} />
      ))}
    </div>
  );
}
