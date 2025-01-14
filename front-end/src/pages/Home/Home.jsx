import { Navbar } from "../../components/Navbar";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Popular from "@/components/Landing/Popular";
import api from "@/api/interceptor";
import Footer from "@/components/Landing/Footer";
import Map from "@/components/Landing/Map";
import Image from "@/components/Image";

const Home = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [upcomingTripData, setUpcomingTripData] = useState({});

  useEffect(() => {
    const fetchUpcomingTrips = async () => {
      try {
        const res = await api.get("/api/itineraries/upcoming/");
        setUpcomingTripData(res?.data || {});
      } catch (error) {
        console.log(error);
      }
    };

    fetchUpcomingTrips();
  }, []);

  return (
    <>
      <Navbar />
      <div className="relative pt-20 h-[700px] p-16 sm:px-16 lg:px-20">
        <Image
          src='home.jpg'
          alt="home image"
          className="absolute top-0 left-0 w-full h-[800px] object-cover object-center z-[-1]"
        />
        <div className="absolute top-0 left-0 w-full h-[850px] bg-custom-gradient z-[-1]" />
        <h2 className="font-medium text-6xl text-center opacity-90 pt-[200px] ">
          Welcome, {userInfo?.name || "Traveler"}
        </h2>
        <p className="text-center mt-4 text-lg">
          Your dream journey begins here. Let's craft the perfect plan for your
          next adventure.
        </p>
      </div>

      <div className="p-20 pt-0 pb-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 max-w-7xl mx-auto">
          <div className="text-center lg:text-left flex-grow">
            <h2 className="font-medium text-3xl mb-4">
              Design Your Dream Trip Today
            </h2>
            <p className="text-lg mb-8">
              Whether you're seeking adventure, relaxation, or a custom getaway,
              we tailor your trip to fit your unique desires.
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
      </div>

      <Popular />

      <div className="p-16 pt-4 mt-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 max-w-7xl mx-auto">
          <div className="w-full lg:w-1/2">
            <Image
              src='travel.jpg'
              alt="Trip Preview"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="text-center lg:text-left flex-grow">
            <h2 className="font-medium text-3xl mb-4">
              Share Your Adventures Through Blogs
            </h2>
            <p className="text-lg mb-8">
              Inspire others with your travel stories! Share your experiences,
              tips, and recommendations in a personalized blog.
            </p>
            <Link to="/blog">
              <Button variant="gold" className="px-8 py-3 group">
                Tell Your Tale
                <ArrowRightIcon className="h-6 w-6 transition duration-300 ease-in-out group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {upcomingTripData.arrival_date && (
        <div className="p-12 rounded-lg">
          <h2 className="font-medium text-3xl mb-10 text-center">
            Your Upcoming Trip
          </h2>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center px-6 sm:pl-32 sm:px-20">
            <img
              src="https://via.placeholder.com/600x400"
              alt="Trip 1"
              className="object-cover rounded-lg "
            />
            <div className="flex-grow">
              <h2 className="text-3xl font-montserrat font-semibold mb-4 group transition-all duration-300 ease-in-out hover:text-primary">
                {upcomingTripData?.destination_location || "No upcoming trip"}
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                <span className="font-semibold">Dates:</span>{" "}
                <span className="text-gray-200">
                  {upcomingTripData?.departure_date} to{" "}
                  {upcomingTripData?.arrival_date}
                </span>
              </p>
              <Link to={`/my-itineraries`}>
                <Button variant="gold">
                  <span>View Details</span>
                  <ArrowRightIcon className="h-6 w-6 transition duration-300 ease-in-out group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 
      <div className="mb-20">
        <h2 className="font-medium text-3xl mb-12 text-center">Your Marks</h2>
        <Map/>
      </div> */}

      <Footer />
    </>
  );
};

export default Home;
