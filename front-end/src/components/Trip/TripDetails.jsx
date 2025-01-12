import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { Star } from "lucide-react";

const TripDetails = ({ tripData }) => {
  const hotels = tripData?.hotel || [];
  const itinerary = tripData?.itinerary || [];
  const travelOptions = tripData?.travel_options || [];
  const flights = tripData?.flight || [];
  const notes = tripData?.note || [];

  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-4">Recommended Hotels</h2>
        <div className="flex gap-5">
          {hotels.map((hotel, index) => (
            <Card
              key={index}
              className="p-4 w-full items-center border-2 border-gold sm:w-1/2 lg:w-1/3"
            >
              <div className="font-semibold text-2xl mb-1">
                {hotel.hotel_name}
              </div>
              <div className="text-sm text-gray-600 flex gap-1">
                <MapPinIcon className="h-5 w-5" />
                <span>{hotel.address}</span>
              </div>
              <div className="text-sm mt-4">{hotel.description}</div>
              <div className="mt-2 font-semibold">
                {hotel.price_per_night}/night
              </div>
              <div className="text-sm text-gray-500 flex gap-1 items-center">
                Rating: {hotel.rating} <Star size={16} />
              </div>
              <div className="mt-2">
                <div className="font-semibold">Amenities:</div>
                <ul className="list-disc pl-5 text-sm">
                  {hotel.amenities?.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </div>
              <div className="font-semibold mt-2">Perks:</div>
              <div className="text-sm">{hotel.general_info}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-5">Itinerary</h2>
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
                {day.activities.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell>{activity.activity_name}</TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell>{activity.ticket_price}</TableCell>
                    <TableCell>{activity.best_time_to_visit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <hr />
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-4">Travel Options</h2>
        {travelOptions.map((option, index) => (
          <Card key={index} className="p-4 mb-4 border-2 border-gold">
            <div className="mb-4">
              <div className="font-semibold text-lg">{option.title}</div>
              <div className="text-sm mt-2 font-medium">
                Mode of Transport:{" "}
                <span className="font-normal">{option.method}</span>
              </div>
              <div className="text-sm mt-2">{option.details}</div>
            </div>
          </Card>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-4">Flights</h2>
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
            {flights.map((flight, index) => (
              <TableRow key={index}>
                <TableCell>{flight.airline}</TableCell>
                <TableCell>{flight.departure_time}</TableCell>
                <TableCell>{flight.arrival_time}</TableCell>
                <TableCell>${flight.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <hr />
      </section>

      <section>
        <h2 className="text-2xl font-medium mb-4">Important Notes</h2>
        <div>
          {notes.map((note, index) => (
            <div key={index}>
              <div className="font-semibold">{note.title}</div>
              <div className="text-sm mb-2">{note.notes}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default TripDetails;
