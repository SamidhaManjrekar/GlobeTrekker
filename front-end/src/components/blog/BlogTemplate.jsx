import React, { useState } from "react";
import { Navbar } from "../Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { tagsData } from "@/data/tagsData";
import { useNavigate } from "react-router-dom";
import api from "@/api/interceptor";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Content is required."),
  tags: z.array(z.string()).min(1, "Select at least one tag."),
});

const Template = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      const res = await api.post('api/your-blogs/', data);
      console.log(res);
      toast.success("Blog Created Successfully!");
      navigate("/blog");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("An error occurred while creating the blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-20 mx-auto max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Create Your Own Blog</h2>
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
                    <Textarea
                      id="content"
                      placeholder="Enter your blog content"
                      {...field}
                    />
                  </FormControl>
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
                      <FormItem key={tag.label} className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            id={tag.label}
                            checked={field.value.includes(tag.label)}
                            onCheckedChange={(checked) => {
                              field.onChange(
                                checked
                                  ? [...field.value, tag.label] 
                                  : field.value.filter((value) => value !== tag.label) 
                              );
                            }}
                          />
                        </FormControl>
                        <Label htmlFor={tag.label} className="text-zinc-400">
                          {tag.label} 
                        </Label>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit" variant="gold" className="w-36" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default Template;