import React from "react";
import { PopularCard } from "@/components/Landing/PopularCard";
import { cardData } from "../../data/cardData";

const Popular = () => {
  return (
    <section
      className="p-16 mt-10 md:text-start flex flex-col gap-5 items-center"
      id="popular"
    >
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4">
        Popular Destinations Loved by Travelers
      </h2>
      <p className="text-sm md:text-base max-w-[80ch] m-auto text-center mb-8">
        Explore the destinations that have captured the hearts of our community.
        Whether you’re drawn to serene beaches, bustling cities, or hidden gems,
        there’s a place waiting for you to discover.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <PopularCard
            key={index}
            location={card.location}
            title={card.title}
            description={card.description}
            image={card.image}
          />
        ))}
      </div>
    </section>
  );
};

export default Popular;