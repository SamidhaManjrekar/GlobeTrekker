import api from "@/api/interceptor";
import { Navbar } from "@/components/Navbar";
import TripCard from "@/components/Trip/TripCard";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "@/components/Image";

const Itinerary = () => {
  const [itineraries, setItineraries] = useState([]);

  const getUniqueCities = (activities) => {
    return [...new Set(activities.map((activity) => activity.city))];
  };

  const deleteTrip = (id) => {
    setItineraries(itineraries.filter((itinerary) => itinerary.id !== id));
  };

  useEffect(() => {
    const fetchAllTrips = async () => {
      try {
        const res = await api.get("/api/itineraries/");
        setItineraries(res?.data || []);
        console.log(itineraries);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    fetchAllTrips();
  }, []);

  return (
    <div className="p-16 mt-4 sm:px-16 lg:px-20">
      <Navbar />
      <div>
        <h1 className="text-center font-montserrat text-4xl font-medium mb-10">Your Itineraries</h1>

        <div className="flex justify-center mb-12">
          <input
            type="text"
            placeholder="Search your itineraries..."
            className="w-full max-w-lg px-4 py-2 border border-gold rounded-md focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>


        <section className="p-12 mt-10 bg-black text-white">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 max-w-7xl mx-auto">
            <div className="text-center lg:text-left flex-grow">
              <h2 className="font-medium text-3xl mb-4">
                Plan More Adventures Now
              </h2>
              <p className="text-lg mb-8">
                Whether you're seeking adventure, relaxation, or a custom
                getaway, we tailor your trip to fit your unique desires.
              </p>
              <Link to="/create-trip">
                <Button variant="gold" className="px-8 py-3 group">
                  Design Your Escape
                  <ArrowRightIcon className="h-6 w-6 transition duration-300 ease-in-out group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="w-full lg:w-1/2">
              <Image
                src='travel2.jpg'
                alt="Trip Preview"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 p-8">
          {itineraries.map((itinerary) => {
            return (
              <TripCard
                key={itinerary.id}
                id={itinerary.id}
                name={itinerary.destination_location}
                imageUrl={itinerary.image_url}
                startDate={itinerary.departure_date}
                endDate={itinerary.arrival_date}
                cities={getUniqueCities(itinerary.activities)}
                deleteTrip={deleteTrip} 
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Itinerary;
