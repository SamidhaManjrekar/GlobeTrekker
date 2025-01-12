import api from "@/api/interceptor";
import { Navbar } from "@/components/Navbar";
import TripDetails from "@/components/Trip/TripDetails";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const formatData = (data) => {
  const days = data.activities.reduce((acc, activity) => {
    const existingDay = acc.find((day) => day.day === activity.day);

    if (existingDay) {
      existingDay.activities.push({
        activity_name: activity.activity_name,
        description: activity.description,
        ticket_price: activity.ticket_price,
        best_time_to_visit: activity.best_time_to_visit,
      });
    } else {
      acc.push({
        day: activity.day,
        date: activity.date,
        city: activity.city,
        location: activity.location,
        activities: [
          {
            activity_name: activity.activity_name,
            description: activity.description,
            ticket_price: activity.ticket_price,
            best_time_to_visit: activity.best_time_to_visit,
          },
        ],
      });
    }

    return acc;
  }, []);

  return {
    ...data,
    itinerary: days,
    activities: undefined,
  };
};

const ItineraryDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState({});

  const handleDownload = () => {
    window.print();
  };

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const res = await api.get(`/api/itineraries/${id}/`);
        const formattedData = formatData(res?.data);
        setData(formattedData);
        console.log(formattedData);
      } catch (error) {
        console.error("Error fetching itinerary:", error);
      }
    };
    fetchItinerary();
  }, [id]);

  return (
    <div className="p-16 mt-4 sm:px-16 lg:px-20 relative">
      <Navbar />
      <h2 className="font-montserrat font-medium text-center text-3xl mb-7">
        Trip To {data.destination_location}
      </h2>
      <TripDetails tripData={data} />
      <div className="flex justify-center group">
        <Button className="mt-7 px-10 flex print:hidden" variant="gold" onClick={handleDownload}>
          Download
          <ArrowRightIcon className="h-6 w-6 transition duration-300 ease-in-out group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};

export default ItineraryDetails;
