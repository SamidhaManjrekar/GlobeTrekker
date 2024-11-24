import React from "react";
import { Navbar } from "../../components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import homeImage from "../../assets/home.jpg";
import aboutImage from "../../assets/about.jpg";
import joinImage from "../../assets/join.jpg";
import { PopularCard } from "@/components/PopularCard";
import { cardData } from "../../data/cardData";
import { exploreData } from "../../data/exploreData";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const LandingPage = () => {
  const autoplayInstance = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const handleMouseEnter = () => {
    autoplayInstance.current?.stop();
  };

  const handleMouseLeave = () => {
    autoplayInstance.current?.play();
  };

  return (
    <>
      <Navbar />
      <section className="relative p-14" id="home">
        <img
          src={homeImage}
          alt="home image"
          className="absolute top-0 left-0 w-full h-[800px] object-cover object-center z-[-1]"
        />
        <div className="absolute top-0 left-0 w-full h-[850px] bg-custom-gradient z-[-1]" />
        <div className="pt-36 text-center">
          <div className="text-center">
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
              <Button variant="gold">
                <span>Plan Your Trip</span>
              </Button>
              <Button variant="outline">
                <span>Join Us</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="relative p-14 mt-10 lg:px-24">
        <div className="gap-12 flex items-center flex-col md:flex-row justify-between">
          <div className="text-center md:text-start">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
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
              destinations—it's about connecting with cultures, uncovering
              unique stories, and making memories that last a lifetime. Whether
              you're planning a solo adventure or a family getaway, GlobeTrekker
              ensures every trip is meaningful, seamless, and tailored to you.
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

      <section
        className="relative p-14 mt-10 md:text-start flex flex-col gap-5 items-center"
        id="popular"
      >
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4">
          Popular Destinations Loved by Travelers
        </h2>
        <p className="text-sm md:text-base max-w-[80ch] m-auto text-center mb-8">
          Explore the destinations that have captured the hearts of our
          community. Whether you’re drawn to serene beaches, bustling cities, or
          hidden gems, there’s a place waiting for you to discover.
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

      <section
        className="p-14 mt-10 flex justify-center flex-col gap-5"
        id="explore"
      >
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center">
          Explore Beyond the Map
        </h2>
        <p className="text-sm md:text-base max-w-[80ch] m-auto text-center mb-8">
          Dive into curated travel recommendations, expert advice, and
          must-visit attractions. Start your journey with GlobeTrekker today.
        </p>
        <div className="px-7">
          <Carousel
            plugins={[autoplayInstance.current]}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            opts={{
              align: "center",
            }}
            className="w-full"
          >
            <CarouselContent>
              {exploreData.map((data, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div className="relative rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={data.image}
                        alt={data.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
                      <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
                        <h3 className="text-2xl font-semibold text-center">
                          {data.title}
                        </h3>
                        <p className="text-center mb-4">{data.description}</p>
                        <Button
                          href={data.link}
                          variant="outline"
                          className="mb-5 group"
                        >
                          <span>Read More</span>
                          <ArrowRightIcon className="h-6 w-6 transition duration-300 ease-in-out group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      <section className="p-14 mt-10 lg:px-24">
        <div className="gap-12 flex items-center flex-col md:flex-row justify-between">
          <div className=" text-center md:text-start">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-sm md:text-base max-w-[80ch] m-auto mt-4">
              Join thousands of travelers who trust GlobeTrekker to make their
              journeys unforgettable. Start planning today and make memories
              that last a lifetime.
            </p>
            <Button variant="gold" className="mt-6">
              <span>Get Started</span>
            </Button>
          </div>
          <div className="overflow-hidden max-w-48 sm:max-w-64 md:max-w-72">
            <img
              src={joinImage}
              alt="Join our community"
              className="w-full object-cover rounded-md"
            />
          </div>
        </div>
      </section>

      <section id="contact" className="p-14 mt-10">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center">
          Contact Us
        </h2>
        <p className="text-sm md:text-base max-w-[80ch] m-auto text-center mb-8">
          Have questions? We're here to help. Reach out to us for personalized
          assistance.
        </p>
        <form className="max-w-lg m-auto flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="p-2 rounded-md"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-2 rounded-md"
          />
          <textarea
            placeholder="Your Message"
            className="p-2 rounded-md"
          ></textarea>
          <Button variant="gold">
            <span>Send Message</span>
          </Button>
        </form>
      </section>

      <footer className="p-4 mt-10 bg-[var(--clr-gold-dark)]">
        <div className="mx-auto">
          <div className="text-center">
            <a href="#" className="font-montserrat font-semibold text-lg">
              Globe Trekker
            </a>
            <p className="mt-1 text-sm">
              Explore the world with us. Your journey begins here.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
