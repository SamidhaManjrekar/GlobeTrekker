import React from "react";
import ExploreCarousel from "../../components/Landing/ExploreCarousel"; 
import BlogCards from "@/components/blog/BlogCards";
import { blogPosts } from "@/data/blogData";
import { exploreData } from "@/data/exploreData";
import { Navbar } from "@/components/Navbar";

const Blog = () => {
  return (
    <div className="p-16 mt-8 sm:px-16 lg:px-20">
      <Navbar/>
      <h2 className="text-center font-montserrat text-4xl font-medium mb-6">
        Start Your Journey Through Ideas
      </h2>

      <section className="my-12">
        <ExploreCarousel exploreData={exploreData} /> 
      </section>

      <section className="px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {blogPosts.map((data, index) => (
          <BlogCards
            key={index}
            title={data.title}
            image={data.image}
            content={data.content}
            id={data.id}
          />
        ))}
      </section>
    </div>
  );
};

export default Blog;