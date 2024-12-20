import React from "react";
import ExploreCarousel from "./ExploreCarousel"; 
import { exploreData } from "../../data/exploreData";

const Explore = () => {
  return (
    <section
      className="p-16 mt-10 flex justify-center flex-col gap-5"
      id="explore"
    >
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center">
        Explore Beyond the Map
      </h2>
      <p className="text-sm md:text-base max-w-[80ch] m-auto text-center mb-8">
        Dive into curated travel recommendations, expert advice, and must-visit
        attractions. Start your journey with GlobeTrekker today.
      </p>
      <ExploreCarousel exploreData={exploreData} />
    </section>
  );
};

export default Explore;