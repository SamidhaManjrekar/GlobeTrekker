import React, { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Image from "../Image";

const ExploreCarousel = ({ exploreData }) => {
  const autoplayInstance = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const handleMouseEnter = () => {
    autoplayInstance.current?.stop();
  };

  const handleMouseLeave = () => {
    autoplayInstance.current?.play();
  };

  return (
    <div
      className="px-7"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel
        plugins={[autoplayInstance.current]}
        opts={{
          align: "center",
        }}
        className="w-full"
      >
        <CarouselContent>
          {exploreData.map((data, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <div className="relative rounded-lg overflow-hidden">
                  <Image
                    src={data.image}
                    alt={data.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
                    <div className="h-3/5 flex flex-col justify-center items-center">
                      <h3 className="text-2xl font-semibold text-center">
                        {data.title}
                      </h3>
                      <p className="text-center">{data.description}</p>
                    </div>
                    <Link to={`/blog/${data.id}`|| data.link}>
                      <Button variant="outline" className="mb-5 group">
                        <span>Read More</span>
                        <ArrowRightIcon className="h-6 w-6 transition duration-300 ease-in-out group-hover:translate-x-1" />
                      </Button>
                    </Link>
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
  );
};

export default ExploreCarousel;
