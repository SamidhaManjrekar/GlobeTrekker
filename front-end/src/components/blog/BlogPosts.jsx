import React from "react";
import { useParams } from "react-router-dom";
import { blogPosts } from "@/data/blogData";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ExploreCarousel from "../Landing/ExploreCarousel";
import { exploreData } from "@/data/exploreData";
import { Navbar } from "../Navbar";

const Posts = () => {
  const { id } = useParams();
  const post = blogPosts.find((post) => post.id === parseInt(id));

  if (!post) {
    return (
      <div className="py-10 px-4 md:px-10 lg:px-20 rounded-lg">
        <h2 className="text-center text-xl">Post Not Found</h2>
      </div>
    );
  }

  const { title, author, date, categories, tags, content, image } = post;

  return (
    <div className="mt-12 py-10 px-4 md:px-10 lg:px-20 rounded-lg">
      <Navbar/>
      <Card className="shadow-md border-4 border-gold">
        <CardHeader className="mb-4">
          <CardTitle>
            <h1 className="text-3xl font-bold text-center mb-4">{title}</h1>
          </CardTitle>
          <div className="flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-600">
            <span>
              <strong>By:</strong> {author}
            </span>
            <span>
              <strong>Published On:</strong> {date}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Categories
            </h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-600 px-4 py-1 text-sm rounded-full cursor-pointer hover:bg-blue-200"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="leading-relaxed text-gray-800 mb-6">
            <p>{content}</p>
          </div>

          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-yellow-100 text-yellow-600 px-3 py-1 text-sm rounded-full shadow-sm transition-all duration-500 hover:bg-yellow-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
              Gallery
            </h2>
            <div className="flex justify-center">
              <img
                src={image}
                alt={title}
                className="rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/4"
              />
            </div>
          </div>
        </CardFooter>
      </Card>

      <div className="my-12">
        <ExploreCarousel exploreData={exploreData} />
      </div>
    </div>
  );
};

export default Posts;
