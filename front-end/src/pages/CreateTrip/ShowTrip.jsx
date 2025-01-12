import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { chatSession } from "@/services/TripGenerator";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import api from "@/api/interceptor";
import TripDetails from "@/components/Trip/TripDetails";
import { getImages } from "@/services/ImageGenerator";

const ShowTrip = () => {
  const location = useLocation();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formData = location.state?.data;

  const formatData = (data) => {
    const formattedActivities = data.itinerary.flatMap((day) =>
      day.activities.map((activity) => ({
        day: day.day,
        date: day.date,
        city: day.city,
        location: day.location,
        activity_name: activity.activity_name,
        description: activity.description,
        ticket_price: activity.ticket_price,
        best_time_to_visit: activity.best_time_to_visit,
      }))
    );

    return {
      ...data,
      activities: formattedActivities,
      itinerary: undefined,
    };
  };

  const saveTrip = async () => {
    setSaving(true);
    try {
      const formattedData = formatData(tripData);
      console.log("Formatted Data to Send:", formattedData);
      await api.post("/api/itineraries/", formattedData);
      navigate("/home");
      toast("Tour trip has been saved!", {
        description: "You can view your saved trip in the My Trips section.",
        action: {
          label: "View Here",
          onClick: () => navigate("/my-itineraries"),
        },
      });
    } catch (error) {
      console.log(error);
      setError("Failed to save the trip. Please try again.");
      toast.error("Error saving trip. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const result = await chatSession.sendMessage(`
          Source: ${formData.source}, 
          Destination: ${formData.destination}, 
          Budget: ${formData.budgetType}, 
          No of Adults: ${formData.numberOfAdults}, 
          No of Children: ${formData.numberOfChildren}, 
          Departure Date: ${formData.departureDate}, 
          Return Date: ${formData.returnDate}, 
          Specific Requirements: ${formData.requirements}
        `);

        const response = await result?.response?.text();
        let data = JSON.parse(response);

        const imageURL = await getImages(formData.destination);
        data = {
          ...data,
          image: imageURL?.url || "https://via.placeholder.com/600x400",
        };
        setTripData(data);
        console.log("data", data);
      } catch (err) {
        console.error("Error generating trip data:", err);
        setError("Failed to generate trip data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [formData]);

  return (
    <>
      <Navbar />
      <div className="p-16 mx-4 pt-20">
        {loading ? (
          <p>Loading your trip plan...</p>
        ) : error ? (
          <p>{error}</p>
        ) : tripData ? (
          <>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-center">
              Your Dream Trip is Now Planned!
            </h1>

            <TripDetails tripData={tripData} />

            <div className="flex justify-center align-middle mt-10 gap-4 sm:gap-8">
              <Link to="/create-trip">
                <Button
                  type="button"
                  variant="gold"
                  className="px-8 sm:px-12 py-2 sm:py-3"
                >
                  Go Back
                </Button>
              </Link>
              <Button
                variant="gold"
                type="button"
                onClick={saveTrip}
                disabled={saving}
                className="px-8 sm:px-12 py-2 sm:py-3"
              >
                {saving ? "Saving..." : "Save Trip"}
              </Button>
            </div>
          </>
        ) : (
          <p>No trip data available.</p>
        )}
      </div>
    </>
  );
};

export default ShowTrip;
