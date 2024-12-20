import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { chatSession } from "@/services/TripGenerator";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Star } from 'lucide-react';

const ShowTrip = () => {
  const location = useLocation();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formData = location.state?.data;

  useEffect(() => {
    const fetchTripData = async () => {
      if (!formData) {
        setError("No form data provided.");
        setLoading(false);
        return;
      }

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
        console.log("Response:", response);

        const data = JSON.parse(response);
        setTripData(data);
      } catch (err) {
        console.error("Error generating trip data:", err);
        setError("Failed to generate trip data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [formData]);

  if (loading) {
    return <p>Loading your trip plan...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!tripData) {
    return <p>No trip data available.</p>;
  }

  // Safely destructure tripData with defaults
  const hotels = tripData?.hotels || [];
  const itinerary = tripData?.itinerary || [];
  const importantNotes = tripData?.importantNotes || {};
  const travelOptions = tripData?.travelOptions || {};
  const flights = tripData?.flights || [];

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 pt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Your Dream Trip is Now Planned!
        </h1>

        {/* Hotels Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recommended Hotels</h2>
          <div className="flex gap-5">
            {hotels.map((hotel, index) => (
              <Card
                key={index}
                className="p-4 shadow-md w-full items-center border-2 border-gold md:w-1/3"
              >
                <div className="font-semibold text-2xl">{hotel.hotelName}</div>
                <div className="text-sm text-gray-600">{hotel.address}</div>
                <div className="text-sm mt-4">{hotel.description}</div>
                <div className="mt-2 font-semibold">
                  {hotel.pricePerNight}/night
                </div>
                <div className="text-sm text-gray-500 flex gap-1 items-center">
                  Rating: {hotel.rating}{" "}
                  <Star size={16} />
                </div>
                <div className="mt-2">
                  <div className="font-semibold">Amenities:</div>
                  <ul className="list-disc pl-5 text-sm">
                    {hotel.amenities?.map((amenity, idx) => (
                      <li key={idx}>{amenity}</li>
                    ))}
                  </ul>
                </div>
                <div className="font-semibold mt-2">Perks:</div>
                <div className="text-sm ">{hotel.generalInfo}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* Itinerary Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-5">Itinerary</h2>
          {itinerary.map((day, index) => (
            <div key={index} className="mb-12">
              <div className="flex justify-between mb-3">
                <div>
                  <div className="text-xl font-bold mb-2">Day {day.day}</div>
                  <div className="text-lg font-semibold">City: {day.city}</div>
                </div>
                <div>
                  <div className="text-md font-light mb-2 text-muted">
                    Date {day.date}
                  </div>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Ticket Pricing</TableHead>
                    <TableHead>Best Time to Visit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {day.activities.map((activity, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{activity.name}</TableCell>
                      <TableCell>{activity.description}</TableCell>
                      <TableCell>{activity.ticketPrice}</TableCell>
                      <TableCell>{activity.bestTimeToVisit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <hr />
            </div>
          ))}
        </section>

        {/* Travel Options Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Travel Options</h2>
          <Card className="p-4 shadow-md mb-4 border-2 border-gold ">
            <div className="mb-4">
              <div className="font-semibold">To the Destination</div>
              <div className="text-sm mt-2">
                Mode of Transport: {travelOptions.toDestination?.method}
              </div>
              <div className="text-sm mt-2">
                {travelOptions.toDestination?.details}
              </div>
            </div>
            <div>
              <div className="font-semibold">Within the Destination</div>
              <div className="text-sm mt-2">
                Mode of Transport: {travelOptions.inDestination?.method}
              </div>
              <div className="text-sm mt-2">
                {travelOptions.inDestination?.details}
              </div>
            </div>
          </Card>
        </section>

        {/* Flight Details Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Flights</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Airline</TableHead>
                <TableHead>Departure Time</TableHead>
                <TableHead>Arrival Time</TableHead>
                <TableHead>Ticket Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flights.map((flight, idx) => (
                <TableRow key={idx}>
                  <TableCell>{flight.airline}</TableCell>
                  <TableCell>{flight.departureTime}</TableCell>
                  <TableCell>{flight.arrivalTime}</TableCell>
                  <TableCell>${flight.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <hr />
        </section>

        {/* Important Notes Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Important Notes</h2>
          <div>
            <div className="font-semibold">Weather</div>
            <div className="text-sm mb-2">{importantNotes.weather}</div>
            <div className="font-semibold">Local Customs</div>
            <div className="text-sm mb-2">{importantNotes.localCustoms}</div>
            <div className="font-semibold">Peak Season</div>
            <div className="text-sm mb-2">{importantNotes.peakSeason}</div>
            <div className="font-semibold">Safety Tips</div>
            <div className="text-sm mb-2">{importantNotes.safetyTips}</div>
          </div>
        </section>

        <div className="flex justify-center align-middle mt-10 gap-9">
          <Link to="/create-trip">
            <Button type="button" variant="gold" className="px-8 w-40">
              Generate Again
            </Button>
          </Link>

          <Button type="submit" variant="gold" className="px-8 w-40">
            Save Trip
          </Button>
        </div>
      </div>
    </>
  );
};

export default ShowTrip;
