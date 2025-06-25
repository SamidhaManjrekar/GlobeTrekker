import React, { useState, useEffect } from "react";
import { Navbar } from "../Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/api/interceptor";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Save } from "lucide-react";
import { uploadToImageKit } from "@/services/UploadImage";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Content is required."),
  tags: z.array(z.string()).min(1, "Select at least one tag."),
  gallery: z.any().optional(),
});

const Template = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [tagsData, setTagsData] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      gallery: "",
    },
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/api/tags/");
        setTagsData(response.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch tags");
      }
    };

    fetchTags();

    if (id) {
      const fetchPost = async () => {
        try {
          const response = await api.get(`/api/blogs/${id}/`);
          setInitialData(response.data);
          setPreviewImage(response.data.gallery_url);
        } catch (error) {
          console.log(error);
          toast.error("Failed to fetch blog post");
        }
      };

      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        content: initialData.content,
        tags: initialData.tags,
        gallery: null,
      });
    }
  }, [initialData, form]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));

    form.setValue("gallery", file);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      let galleryUrl = "";

      if (selectedFile) {
        galleryUrl = await uploadToImageKit(selectedFile);
      } else if (previewImage) {
        galleryUrl = previewImage;
      }

      const payload = {
        title: data.title,
        content: data.content,
        tags: data.tags,
        gallery_url: galleryUrl,
      };

      let res;
      if (id) {
        res = await api.put(`/api/blogs/${id}/`, payload);
        toast.success("Blog Updated Successfully!");
      } else {
        res = await api.post("/api/your-blogs/", payload);
        toast.success("Blog Created Successfully!");
      }

      navigate("/blog");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(
        error.response?.data?.detail ||
          "An error occurred while saving the blog."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!tagsData.length || (id && !initialData)) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="mt-20 mx-auto max-w-6xl">
        <h2 className="text-center font-montserrat text-4xl font-medium mb-10">
          {id ? "Edit Your Blog" : "Create Your Own Blog"}
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title" className="text-main">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Enter your blog title"
                      {...field}
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
                  <FormLabel htmlFor="content" className="text-main">
                    Content
                  </FormLabel>
                  <FormControl>
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Write your content here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gallery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="gallery" className="text-main">
                    Upload Gallery Image
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="gallery"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </FormControl>
                  {previewImage && (
                    <div className="mt-2">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-xs rounded-lg"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {tagsData.map((tag) => (
                      <FormItem
                        key={tag.id}
                        className="flex items-center space-x-2"
                      >
                        <FormControl>
                          <Checkbox
                            id={tag.id}
                            checked={field.value.includes(tag.name)}
                            onCheckedChange={(checked) => {
                              field.onChange(
                                checked
                                  ? [...field.value, tag.name]
                                  : field.value.filter(
                                      (value) => value !== tag.name
                                    )
                              );
                            }}
                          />
                        </FormControl>
                        <Label htmlFor={tag.id} className="text-zinc-400">
                          {tag.name}
                        </Label>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                variant="gold"
                className="w-36"
                disabled={loading}
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Submitting..." : id ? "Update Blog" : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default Template;
