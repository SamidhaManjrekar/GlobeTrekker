import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { chatSession } from "@/services/TripGenerator";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import api from "@/api/interceptor";
import TripDetails from "@/components/Trip/TripDetails";
import { getImage } from "@/services/ImageGenerator";

const ShowTrip = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.data;
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripAndImage = async () => {
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
        const data = JSON.parse(response);

        const imageResponse = await getImage(data.destination_location);
        console.log(imageResponse.url);
        setTripData({ ...data, image_url: imageResponse.url });
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to generate trip data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTripAndImage();
  }, [formData]);

  useEffect(() => {
    console.log("Updated tripData:", tripData);
  }, [tripData]);

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