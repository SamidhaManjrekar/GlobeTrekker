import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ExploreCarousel from "../Landing/ExploreCarousel";
import { exploreData } from "@/data/exploreData";
import { format } from "date-fns";
import { Navbar } from "../Navbar";
import api from "@/api/interceptor";
import { Pencil, Trash2, Save } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

const Posts = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [editState, setEditState] = useState({ title: "", content: "", tags: "" });
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
        setEditState({
          title: res.data.title || "",
          content: res.data.content || "",
          tags: res.data.tags?.join(", ") || "",
        });
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
      await api.delete(`/api/blogs/${id}/`);
      setIsAlertOpen(false);
      navigate("/blog");
      toast.success("Blog post deleted successfully");
    } catch (error) {
      console.error("Error deleting blog post:", error);
      setIsAlertOpen(false);
      toast.error("Failed to delete the blog post");
    }
  };

  const handleEdit = async () => {
    try {
      await api.put(`/api/blogs/${id}/`, {
        title: editState.title,
        content: editState.content,
        tags: editState.tags.split(",").map(tag => tag.trim()),
      });
      toast.success("Blog post updated successfully");
      navigate(`/blog/${id}`);
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast.error("Failed to update the blog post");
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
        <Card className="shadow-md border-4 border-gold">
          <CardHeader className="mb-4">
            <CardTitle>
              <h1 className="text-3xl font-bold text-center mb-4">
                {data?.title || "Untitled"}
              </h1>
            </CardTitle>
            <div className="flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-600">
              <span>
                <strong>By:</strong> {data?.author || "Unknown"}
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
                      className="bg-yellow-100 text-yellow-600 px-3 py-1 text-sm rounded-full shadow-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent>
            <div className="leading-relaxed text-gray-800 mb-6">
              <p>{data?.content || "No content available"}</p>
            </div>

            {data.gallery?.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
                  Gallery
                </h2>
                <div className="flex justify-center">
                  <img
                    src={data.gallery}
                    alt={data.title}
                    className="rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/4"
                  />
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            {currentUser?.name === data?.author && (
              <div className="flex gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="gold" className="w-28">
                      <Pencil /> Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Your Blog</DialogTitle>
                      <DialogDescription>
                        Make changes to your blog here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={editState.title}
                          onChange={e =>
                            setEditState({ ...editState, title: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={editState.content}
                          onChange={e =>
                            setEditState({ ...editState, content: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                          id="tags"
                          value={editState.tags}
                          onChange={e =>
                            setEditState({ ...editState, tags: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleEdit} variant="gold"><Save/>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="gold" className="w-28">
                      <Trash2 /> Delete
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
          </CardFooter>
        </Card>
      )}

      <div className="my-12">
        <ExploreCarousel exploreData={exploreData} />
      </div>
    </div>
  );
};

export default Posts;
