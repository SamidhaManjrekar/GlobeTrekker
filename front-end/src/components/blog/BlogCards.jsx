import React from "react";
import DOMPurify from "dompurify";
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
import Image from "../Image";

const BlogCards = ({ data }) => {
  const sanitizedContent = DOMPurify.sanitize(data.content);

  return (
    <div className="my-6 w-full sm:w-54 mx-auto">
      <Card className="relative group border-2 border-gold">
        <CardHeader className="relative p-0">
          <Image
            src={data.gallery_url}
            alt={data.title}
            className="w-full h-56 object-cover rounded-t-md "
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80 rounded-t-lg"></div>
          <CardTitle className="absolute bottom-4 left-4 p-1 text-white text-xl font-semibold z-10">
            {data.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 text-white bg-zinc-950">
          <p
            className="line-clamp-3 text-sm"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </CardContent>

        <CardFooter className="flex justify-center text-white bg-zinc-950 rounded-b-lg">
          <Link to={`/blog/${data.id}`}>
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