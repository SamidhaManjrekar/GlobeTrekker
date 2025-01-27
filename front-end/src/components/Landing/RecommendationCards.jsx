import { MapPinIcon } from "lucide-react";
import React from "react";

const RecommendationsCard = ({ title, image }) => {
  return (
    <div className="relative w-full h-[300px] rounded-md overflow-hidden">
      <div className="absolute left-0 top-0 p-4 flex flex-col gap-2">
        <div className="flex gap-2">
          <MapPinIcon className="h-5 w-5" />
          <span className="text-sm md:text-base font-medium">{title}</span>
        </div>
      </div>
      <img
        src={image || "https://via.placeholder.com/600x400"}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
    </div>
  );
};

export default RecommendationsCard;