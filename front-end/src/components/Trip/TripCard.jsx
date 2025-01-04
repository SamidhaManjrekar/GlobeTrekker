import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const TripCard = ({ name, startDate, endDate, cities, id }) => {
  return (
    <div>
      <div className="flex gap-5 mt-6">
        <img
          src="https://via.placeholder.com/600x400"
          alt="Trip 1"
          className="w-1/3 object-cover rounded-md"
        />
        <div className="flex-grow">
          <h2 className="text-2xl font-montserrat mb-4 group-hover:underline">
            {name}
          </h2>
          <p className="text-gray-400 ">
            <span className="font-semibold">Dates:</span> {startDate} to {endDate}
          </p>
          <p className="text-gray-400 mb-5">
            <span className="font-semibold">Cities:</span> {cities.join(", ")}
          </p>
          <Link to={`/itinerary/${id}`}>
            <Button variant="gold" className="group">
              <span>View Details</span>
              <ArrowRightIcon className="h-6 w-6 transition duration-300 ease-in-out group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
