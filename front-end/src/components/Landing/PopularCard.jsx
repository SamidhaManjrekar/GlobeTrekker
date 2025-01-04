import React from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export const PopularCard = ({ location, title, description, image }) => {
  return (
    <article className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 max-w-xs">

      <div className="relative h-[100%] overflow-hidden">
        <div className="absolute m-6 flex flex-col gap-2 ">
          <div className="flex gap-2">
            <MapPinIcon className="h-5 w-5" />
            <span className="text-sm md:text-base">{location}</span>
          </div>
          <h2 className="text-lg font-bold md:text-xl">{title}</h2>
        </div>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-between p-6 space-y-3 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 text-gray-400">
            <MapPinIcon className="h-5 w-5" />
            <span className="text-sm md:text-base">{location}</span>
          </div>
          <h2 className="text-lg font-bold md:text-xl">{title}</h2>
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </article>
  );
};
