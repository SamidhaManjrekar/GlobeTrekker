import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Image from "../Image";

const Join = () => {
  return (
    <section className="p-16 mt-10 lg:px-24">
      <div className="gap-12 flex items-center flex-col md:flex-row justify-between">
        <div className=" text-center md:text-start">
          <h2 className="text-lg font-medium  sm:text-xl md:text-2xl lg:text-3xl">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-sm md:text-base max-w-[80ch] m-auto mt-4">
            Join thousands of travelers who trust GlobeTrekker to plan their
            dream trips. Sign up today and unlock a world of endless
            possibilities.
          </p>
          <Link to="/signup">
            <Button variant="gold" className="mb-5 group mt-4">
              <span>Join Today</span>
              <ArrowRightIcon className="h-6 w-6 transition duration-300 ease-in-out group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        <div className="overflow-hidden max-w-xs">
          <Image
            src="join.jpg"
            alt="about image"
            className="w-full object-cover rounded-md"
          />
        </div>
      </div>
    </section>
  );
};

export default Join;