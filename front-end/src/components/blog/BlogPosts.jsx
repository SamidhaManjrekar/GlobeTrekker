import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { format, set } from "date-fns";
import { Navbar } from "../Navbar";
import api from "@/api/interceptor";
import { Pencil, Trash2, ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "../ui/avatar";
import DOMPurify from "dompurify";

const Posts = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submit, setSubmit] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setCurrentUser(userInfo);
      } catch (err) {
        console.error("Error fetching current user info:", err);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const res = await api.get(`/api/blogs/${id}/`);
        setData(res.data);
        setLikeCount(res.data.likes || 0);
        setLiked(res.data.liked_by_current_user || false);

        const commentsData = await api.get(`/api/blogs/${id}/comments/`);
        setComments(commentsData.data);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/api/blogs/${id}/`);
      navigate("/blog");
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete the post");
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    setSubmit(true);
    try {
      const res = await api.post(`/api/blogs/${id}/comments/`, {
        content: newComment,
      });
      setComments([res.data, ...comments]);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setSubmit(false);
    }
  };

  const handleLike = async () => {
    try {
      const res = await api.post(`/api/like/${id}/`);
      setLiked(res.data.liked);
      setLikeCount(res.data.likes_count);
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like the post");
    }
  };

  return (
    <div className="mt-12 py-10 px-4 md:px-10 lg:px-20 rounded-lg">
      <Navbar />
      {loading ? (
        <div className="text-center text-lg">Loading data...</div>
      ) : error ? (
        <div className="text-center text-lg text-red-500">Error: {error}</div>
      ) : (
        <Card className="border-4 border-gold">
          <CardHeader className="mb-4 relative">
            <CardTitle>
              <h1 className="text-3xl font-bold text-center mb-4">
                {data?.title || "Untitled"}
              </h1>
            </CardTitle>
            <div className="absolute right-4 top-2">
              {currentUser?.id === data?.author?.id && (
                <div className="flex gap-4">
                  <Button variant="gold" onClick={() => navigate(`/blog-edit/${id}`)}>
                    <Pencil />
                  </Button>

                  <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="gold">
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-600">
              <span>
                <strong>By:</strong> {data?.author?.name || "Unknown"}
              </span>
              <span>
                <strong>Published On:</strong>{" "}
                {data?.created_at
                  ? format(new Date(data.created_at), "MMMM dd, yyyy")
                  : "Unknown"}
              </span>
            </div>

            {data?.tags?.length > 0 && (
              <div className="text-left pt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {data.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-yellow-100 text-yellow-600 px-3 py-1 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent>
            <div
              className="leading-relaxed text-gray-800 mb-6"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(data?.content || "No content available"),
              }}
            />
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <Button variant="gold" onClick={handleLike}>
                <ThumbsUp
                  className={`w-6 h-6 ${liked ? "text-black" : "text-gray-500"}`}
                />
              </Button>
              <span className="text-lg font-semibold">{likeCount}</span>
            </div>
          </CardFooter>

          <CardFooter>
            <div className="mt-12 w-full">
              <h2 className="text-2xl font-semibold mb-4">Comments</h2>
              {comments.length === 0 ? (
                <p>No comments yet.</p>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="px-4 py-2 border rounded-lg bg-gray-50 shadow-sm"
                    >
                      <div className="flex gap-4 mb-1 items-center">
                        <Avatar className="w-10 h-10 border-gray-400 border-2">
                          <AvatarFallback className="uppercase">
                            {comment.author?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <div className="font-semibold">{comment.author}</div>
                          <div className="text-xs text-gray-500">
                            {format(
                              new Date(comment.created_at),
                              "MMMM dd, yyyy"
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8">
                <h3 className="font-semibold text-lg">Add a Comment</h3>
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment here"
                    rows="4"
                    className="w-full md:w-4/5 mt-2"
                  />
                  <Button
                    onClick={handleAddComment}
                    variant="gold"
                    disabled={submit}
                    className="md:w-1/5 mt-4 md:mt-0"
                  >
                    {submit ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Posts;