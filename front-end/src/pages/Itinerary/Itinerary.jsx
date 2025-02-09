import api from "@/api/interceptor";
import { Navbar } from "@/components/Navbar";
import TripCard from "@/components/Trip/TripCard";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "@/components/Image";
import { chatSession } from "@/services/RecommendationGenerator";
import RecommendationsCard from "@/components/Landing/RecommendationCards";
import { getImage } from "@/services/ImageGenerator";
import { format } from "date-fns";

const Itinerary = () => {
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [completedTrips, setCompletedTrips] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const getRecommendations = async (destinations) => {
    try {
      let result;
      if (!destinations || destinations.length === 0) {
        result = await chatSession.sendMessage(
          "No destinations provided"
        );
      } else {
        result = await chatSession.sendMessage(destinations);
      }
      const data = JSON.parse(result?.response?.text());

      const recommendations = await Promise.all(
        data.map(async (item) => {
          try {
            const imageResponse = await getImage(item.recommendation);
            return { ...item, image: imageResponse?.url };
          } catch (error) {
            console.error(
              `Error fetching image for ${item.recommendation}:`,
              error
            );
            return { ...item, image: "https://via.placeholder.com/600x400" };
          }
        })
      );

      setRecommendations(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  useEffect(() => {
    const fetchAllTrips = async () => {
      try {
        const res = await api.get("/api/itineraries/");
        const allTrips = res?.data || [];
        const today = format(new Date(), "yyyy-MM-dd");
        const upcoming = allTrips.filter((trip) => trip.arrival_date >= today);
        const completed = allTrips.filter((trip) => trip.arrival_date < today);

        setUpcomingTrips(upcoming);
        setCompletedTrips(completed);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    const fetchRecommendationData = async () => {
      try {
        const res = await api.get("/api/itineraries/destinations/");
        const destinations = [
          ...new Set(res.data.map((item) => item.destination_location)),
        ];
        await getRecommendations(destinations);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllTrips();
    fetchRecommendationData();
  }, []);

  const getUniqueCities = (activities = []) => {
    return [...new Set(activities.map((activity) => activity.city))];
  };

  const deleteTrip = (id) => {
    setUpcomingTrips((prev) => prev.filter((trip) => trip.id !== id));
    setCompletedTrips((prev) => prev.filter((trip) => trip.id !== id));
  };

  return (
    <div className="p-8 sm:p-16 mt-4">
      <Navbar />
      <h1 className="text-center font-montserrat text-3xl sm:text-4xl font-medium mb-8 sm:mb-10">
        Your Adventures
      </h1>

      <div className="p-8 sm:p-12 bg-black text-white rounded-lg shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 max-w-7xl mx-auto">
          <div className="text-center lg:text-left flex-grow">
            <h2 className="font-medium text-2xl sm:text-3xl mb-4">
              Plan More Adventures Now
            </h2>
            <p className="text-lg mb-8">
              Whether you're seeking adventure, relaxation, or a custom getaway,
              we tailor your trip to fit your unique desires.
            </p>
            <Link to="/create-trip">
              <Button
                variant="gold"
                className="px-6 py-3 flex items-center gap-2"
              >
                <span>Design Your Escape</span>
                <ArrowRightIcon className="h-5 w-5 transition duration-300 ease-in-out group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="w-full lg:w-1/2">
            <Image
              src="travel2.jpg"
              alt="Trip Preview"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      {upcomingTrips.length > 0 && (
        <>
          <h2 className="text-center font-light text-3xl mb-10">
            Upcoming Escapes
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-4 px-4 sm:px-8">
            {upcomingTrips.map((trip) => (
              <TripCard
                key={trip.id}
                id={trip.id}
                name={trip.destination_location}
                imageUrl={trip.image_url}
                startDate={trip.departure_date}
                endDate={trip.arrival_date}
                cities={getUniqueCities(trip.activities)}
                deleteTrip={deleteTrip}
              />
            ))}
          </div>
        </>
      )}

      {completedTrips.length > 0 && (
        <>
          <h2 className="text-center mt-20 font-light text-3xl mb-10">
            Past Explorations
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-4 px-4 sm:px-8">
            {completedTrips.map((trip) => (
              <TripCard
                key={trip.id}
                id={trip.id}
                name={trip.destination_location}
                imageUrl={trip.image_url}
                startDate={trip.departure_date}
                endDate={trip.arrival_date}
                cities={getUniqueCities(trip.activities)}
                deleteTrip={deleteTrip}
              />
            ))}
          </div>
        </>
      )}

      {recommendations.length > 0 && (
        <div className="mt-12">
          <h2 className="text-center mt-20 font-light text-3xl mb-10">
            Where You Should Go Next
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-8">
            {recommendations.map((rec, index) => (
              <RecommendationsCard
                key={index}
                title={rec.recommendation}
                image={rec.image}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Itinerary;
