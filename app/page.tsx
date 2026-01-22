"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const POSTS_PER_PAGE = 10;

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [displayedCount, setDisplayedCount] = useState(POSTS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Post[]>(
          "https://jsonplaceholder.typicode.com/posts"
        );
        setPosts(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => prev + POSTS_PER_PAGE);
      setLoadingMore(false);
    }, 300);
  };

  const getExcerpt = (text: string) => {
    return text.length > 60 ? text.substring(0, 60) + "..." : text;
  };

  const displayedPosts = posts.slice(0, displayedCount);
  const hasMore = displayedCount < posts.length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <>
            <div className="space-y-4">
              {displayedPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-in fade-in duration-500"
                  style={{
                    animationDelay: `${(index % POSTS_PER_PAGE) * 50}ms`,
                  }}
                >
                  <Link href={`/post/${post.id}`}>
                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <h2 className="text-xl font-semibold mb-2 capitalize">
                        {post.title}
                      </h2>
                      <p className="text-gray-600">{getExcerpt(post.body)}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-2 cursor-pointer"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "More"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
