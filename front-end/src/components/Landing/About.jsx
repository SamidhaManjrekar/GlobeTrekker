import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import aboutImage from "../../assets/about.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="p-16 mt-10 lg:px-24">
      <div className="gap-12 flex items-center flex-col md:flex-row justify-between">
        <div className="text-center md:text-start">
          <h2 className="text-lg font-medium  sm:text-xl md:text-2xl lg:text-3xl">
            Our Story
          </h2>
          <p className="my-8 text-sm md:text-base max-w-[80ch]">
            GlobeTrekker began with a simple idea: to make travel planning as
            enjoyable as the journey itself. From discovering hidden gems to
            exploring iconic landmarks, we’ve created a platform that helps
            travelers curate unforgettable experiences.
          </p>
          <p className="my-8 text-sm md:text-base max-w-[80ch]">
            We believe travel is about more than just ticking off
            destinations—it's about connecting with cultures, uncovering unique
            stories, and making memories that last a lifetime. Whether you're
            planning a solo adventure or a family getaway, GlobeTrekker ensures
            every trip is meaningful, seamless, and tailored to you.
          </p>
          <Button variant="gold" className="mb-5 group">
            <span>Learn More</span>
            <ArrowRightIcon className="h-6 w-6 transition duration-300 ease-in-out group-hover:translate-x-1" />
          </Button>
        </div>
        <div className="overflow-hidden max-w-xs">
          <img
            src={aboutImage}
            alt="about image"
            className="w-full object-cover rounded-md"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;