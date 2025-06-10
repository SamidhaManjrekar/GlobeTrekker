import React, { useEffect, useState } from "react";
import ExploreCarousel from "../../components/Landing/ExploreCarousel";
import BlogCards from "@/components/blog/BlogCards";
import { Navbar } from "@/components/Navbar";
import api from "@/api/interceptor";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { tagsData } from "@/data/tagsData";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const Blog = () => {
  const [blogData, setBlogData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [topBlogs, setTopBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const res = await api.get("api/your-blogs/");
        setBlogData(res.data);
      } catch (error) {
        setError(error.response?.data || "Failed to fetch blogs");
      }
    };

    const fetchTopBlogs = async () => {
      try {
        const response = await api.get(`/api/blogs/top-liked/`);
        console.log("Top Blogs Response:", response.data);
        setTopBlogs(response.data);
      } catch (error) {
        setError(error.response?.data || "Failed to fetch blogs");
      }
    };

    fetchUserBlogs();
    fetchTopBlogs();
  }, []);

  useEffect(() => {
    const fetchAllBlogs = async () => {
      setLoading(true);
      try {
        const res = value
          ? await api.get(`api/tags/${value}/blogs/`)
          : await api.get("api/all-blogs/");
        setAllData(res.data.results);
      } catch (error) {
        setError(error.response?.data || "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchAllBlogs();
  }, [value]);

  return (
    <div className="p-16 mt-8 sm:px-16 lg:px-20">
      <Navbar />
      <h2 className="text-center font-montserrat text-4xl font-medium mb-10">
        Start Your Journey Through Ideas
      </h2>

      <h3 className="text-center mt-7 font-light mb-5 text-3xl">Top blogs</h3>
      <section className="mb-10">
        <ExploreCarousel exploreData={topBlogs} />
      </section>

      <div className="p-16 pt-4 mt-8">
        <h2 className="text-center mt-7 font-light mb-5 text-3xl">
          Create your own blog
        </h2>
        <p className="text-lg mb-8 text-center">
          Inspire others with your travel stories! Share your experiences,
          tips, and recommendations in a personalized blog.
        </p>
        <div className="flex justify-center">
          <Link to="/blog-create">
            <Button variant="gold" className="px-8 py-3 group">
              Start Now
              <ArrowRightIcon className="h-6 w-6 transition duration-300 ease-in-out group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading blogs...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <h3 className="text-center mt-12 font-light mb-5 text-3xl">
            Stories From Around The World
          </h3>
          <div className="flex justify-end items-center space-x-4">
            <p className="text-sm text-muted-foreground">Filter By Tags:</p>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? tagsData.find((tag) => tag.value === value)?.label
                    : "Select tag..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {tagsData.map((tag) => (
                        <CommandItem
                          key={tag.value}
                          value={tag.value}
                          onSelect={(currentValue) => {
                            setValue(currentValue);
                            setOpen(false);
                          }}
                        >
                          {tag.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              value === tag.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <section className="px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {allData.map((data) => (
              <BlogCards key={data.id} data={data} />
            ))}
          </section>

          {blogData.length > 0 && (
            <div>
              <h3 className="text-center mt-7 font-light mb-5 text-3xl">
                Your Personal Blog Collection
              </h3>
              <section className="px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {blogData.map((data, index) => (
                  <BlogCards key={index} data={data} />
                ))}
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Blog;
