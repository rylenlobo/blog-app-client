import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";

// Mark this page as dynamically rendered
export const dynamic = "force-dynamic";

interface BlogPost {
  _id: string;
  title: string;
  summary: string;
  authorId: { firstName: string; lastName: string };
  createdAt: string;
}

interface BlogCardProps {
  readonly _id: string;
  readonly title: string;
  readonly summary: string;
  readonly authorId: { firstName: string; lastName: string };
  readonly createdAt: Date;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await api.get("/blog/posts");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

function BlogCard({ _id, title, summary, authorId, createdAt }: BlogCardProps) {
  return (
    <Link href={`/blog/${_id}`}>
      <Card className="group w-full max-w-xl mx-auto rounded-sm shadow-xs border-1 border-border px-0 pb-0 bg-background">
        <CardContent className="flex flex-col gap-2 px-0 group-hover:shadow-sm transition duration-200 ease-in-out">
          <div className="px-5">
            <div className="text-sm flex flex-col sm:flex-row sm:justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
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

          <div className="flex items-center justify-between mt-2 border-t-1 px-5 py-3">
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
    </Link>
  );
}

export default async function Home() {
  // Fetch blog posts
  const blogPosts = await getBlogPosts();

  return (
    <div className="pt-22 p-4 grid gap-3">
      {blogPosts.length > 0 ? (
        blogPosts.map((post) => (
          <BlogCard
            key={post._id}
            {...post}
            createdAt={new Date(post.createdAt)}
          />
        ))
      ) : (
        <p>No blog posts found</p>
      )}
    </div>
  );
}
