import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import homeImage from "../../assets/home.jpg";

const HeroSection = () => {
  return (
    <section className="relative p-16 pt-20" id="home">
      <img
        src={homeImage}
        alt="home image"
        className="absolute top-0 left-0 w-full h-[800px] object-cover object-center z-[-1]"
      />
      <div className="absolute top-0 left-0 w-full h-[850px] bg-custom-gradient z-[-1]" />
      <div className="pt-36 text-center">
        <h3 className="text-xl mb-2 md:text-2xl lg:text-3xl">
          Welcome to Globe Trekker
        </h3>
        <h1 className="text-4xl mb-6 md:text-5xl lg:text-6xl">
          Explore the world
        </h1>
        <p className="mb-8 text-sm md:text-base max-w-[80ch] m-auto">
          Globe Trekker is your ultimate travel companion, offering expert
          guides, tips, and personalized itineraries to make your journey
          unforgettable. Whether you seek adventure, relaxation, or cultural
          immersion, we have the perfect destinations for you.
        </p>
        <div className="flex justify-center items-center gap-4">
          <Link to={"/create-trip"}>
            <Button variant="gold">
              <span>Plan Your Trip</span>
            </Button>
          </Link>
          <Link to={"/signup"}>
            <Button variant="outline">
              <span>Get Started</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;