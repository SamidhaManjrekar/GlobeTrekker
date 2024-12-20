import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const BlogCards = ({ title, image, content, id }) => {
  return (
    <div className="my-6 w-full sm:w-54 mx-auto">
      <Card className="relative group border-2 border-gold">
        <CardHeader className="relative p-0">
          <img
            src={image}
            alt={title}
            className="w-full h-56 object-cover rounded-t-md"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80 rounded-t-lg"></div>
          <CardTitle className="absolute bottom-4 left-4 text-white text-xl font-semibold z-10">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 text-white bg-zinc-950">
          <p className="line-clamp-3 text-sm">{content}</p>
        </CardContent>

        <CardFooter className="text-white bg-zinc-950 rounded-b-lg">
          <Link to={`/blog/${id}`}>
            <Button variant="gold" className="w-full group">
              <span>Read More</span>
              <ArrowRightIcon className="h-6 w-6 transition duration-300 ease-in-out group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogCards;