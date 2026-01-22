"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        
        const [postResponse, commentsResponse] = await Promise.all([
          axios.get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
            timeout: 5 * 1000
          }),
          axios.get<Comment[]>(
            `https://jsonplaceholder.typicode.com/comments?postId=${postId}`, {
                timeout: 5 * 1000
              }
          ),
        ]);

        const foundPost = postResponse.data.find(
          (p) => p.id.toString() === postId
        );

        if (!foundPost) {
          setError("Post not found");
        } else {
          setPost(foundPost);
          setComments(commentsResponse.data);
        }
        
        setError(null);
      } catch (err) {
        setError("Failed to load post details. Please try again later.");
        console.error("Error fetching post details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-12 text-red-500">
            {error || "Post not found"}
          </div>
          <div className="flex justify-center mt-4">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-6 capitalize">{post.title}</h1>

        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">{post.body}</p>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">
            Comments ({comments.length})
          </h2>

          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments yet</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {comment.name}
                      </h3>
                      <p className="text-sm text-gray-500">{comment.email}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-2">{comment.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
