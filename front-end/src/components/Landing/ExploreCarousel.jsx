import React, { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "../Image";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "lucide-react";

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

  const cleanImageUrl = (url) => {
    if (!url) return "travel.jpg";

    const baseUrl = "ik.imagekit.io/fnrswkvxr/";
    if (url.includes(baseUrl)) {
      const lastIndex = url.lastIndexOf(baseUrl);
      return url.substring(lastIndex + baseUrl.length);
    }
    return url;
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
                    src={cleanImageUrl(data.gallery_url)}
                    alt={data.title || "Travel destination"}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
                    <div className="h-3/5 flex flex-col justify-center items-center">
                      <h3 className="text-2xl font-medium font-montserrat text-center">
                        {data.title}
                      </h3>
                      <p className="text-center">{data.description}</p>
                      {data.id && (
                        <Link to={`/blog/${data.id}`}>
                          <Button variant="secondary" className="w-full group mt-4">
                            <span>Read More</span>
                            <ArrowRightIcon className="h-6 w-6 transition duration-300 ease-in-out group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      )}
                    </div>
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
