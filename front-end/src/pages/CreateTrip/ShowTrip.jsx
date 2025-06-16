import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { chatSession } from "@/services/TripGenerator";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import api from "@/api/interceptor";
import TripDetails from "@/components/Trip/TripDetails";
import { getImage } from "@/services/ImageGenerator";
import axios from "axios";

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
      if (!formData) {
        setError(
          "No trip request data found. Please go back and create a trip."
        );
        setLoading(false);
        return;
      }

      try {
        const departureDate =
          formData.departureDate instanceof Date
            ? formData.departureDate.toISOString().split("T")[0]
            : formData.departureDate;
        const returnDate =
          formData.returnDate instanceof Date
            ? formData.returnDate.toISOString().split("T")[0]
            : formData.returnDate;

        const payload = {
          source: formData.source,
          destination: formData.destination,
          departure_date: departureDate,
          return_date: returnDate,
          activity_preferences: formData.requirements,
          budget: formData.budgetType,
          no_of_adults: formData.numberOfAdults,
          no_of_children: formData.numberOfChildren,
        };

        const response = await axios.post(
          "http://127.0.0.1:8001/plan_trip",
          payload
        );
        const data = response.data;

        if (data && data.itinerary) {
          const destinationForImage =
            data.user_request_summary?.destination || data.destination;
          let imageUrl = null;
          if (destinationForImage) {
            try {
              const imageResponse = await getImage(destinationForImage);
              imageUrl = imageResponse?.url;
              console.log("Generated Image URL:", imageUrl);
            } catch (imageError) {
              console.warn("Failed to generate image:", imageError);
              imageUrl =
                "https://placehold.co/600x400/CCCCCC/000000?text=No+Image";
              toast.warning("Could not generate an image for the destination.");
            }
          } else {
            console.warn("No destination for image generation.");
            imageUrl =
              "https://placehold.co/600x400/CCCCCC/000000?text=No+Image";
          }

          setTripData({ ...data, image_url: imageUrl });
          toast.success("Your trip plan has been generated!");
        } else {
          setError("Backend generated incomplete trip data. Please try again.");
          console.error(
            "FastAPI response did not contain a valid itinerary:",
            data
          );
          toast.error("Failed to generate complete trip. Check backend logs.");
        }
      } catch (err) {
        console.error("Error generating trip data from FastAPI backend:", err);
        setError(
          "Failed to generate trip data. Please ensure the FastAPI backend is running on port 8001 and try again. " +
            (err.response?.data?.detail || err.message)
        );
        toast.error(
          "Error generating trip: " +
            (err.response?.data?.detail || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTripAndImage();
  }, [formData, navigate]);

  const formatData = (data) => {
    if (!data || !data.user_request_summary) {
      console.error(
        "Trip data or user request summary is missing for Django formatting."
      );
      return null;
    }

    const formattedActivities = data.itinerary.flatMap((day) =>
      day.activities.map((activity) => ({
        day: day.day,
        date: day.date,
        city: day.city,
        location: day.city, 
        activity_name: activity.activity_name,
        description: activity.description,
        ticket_price: activity.ticket_price,
        best_time_to_visit: activity.best_time_to_visit,
      }))
    );

    const formattedData = {
      arrival_date: data.user_request_summary.return_date, 
      budget_type: data.user_request_summary.budget, 
      departure_date: data.user_request_summary.departure_date,
      destination_location: data.user_request_summary.destination, 
      source_location: data.user_request_summary.source, 
      
      image_url: data.image_url, 
      
      travel_options: data.travel_options.map(option => ({
        method: option.method,
        details: option.description,
      })),

      activities: formattedActivities,
      flight: data.flight,
      hotel: data.hotels.map(hotel => ({
        ...hotel,
        general_info: hotel.perks, 
      })),
      note: data.note,
    };

    return formattedData;
  };

  const saveTrip = async () => {
    setSaving(true);
    try {
      const formattedData = formatData(tripData);

      if (!formattedData) {
        setError("Failed to format trip data for saving.");
        toast.error("Failed to save trip: Data formatting error.");
        setSaving(false);
        return;
      }

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
      console.error("Error saving trip to Django backend:", error);
      setError("Failed to save the trip. Please try again.");
      toast.error(
        "Error saving trip: " + (error.response?.data?.detail || error.message)
      );
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
