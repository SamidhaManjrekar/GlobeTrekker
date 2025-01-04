import api from '@/api/interceptor'
import { Navbar } from '@/components/Navbar'
import TripDetails from '@/components/Trip/TripDetails'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

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
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchItinerary = async() => {
      const res = await api.get(`/api/itineraries/${id}/`);
      const formattedData = formatData(res?.data);
      setData(formattedData);
      console.log(formattedData);
    }

    fetchItinerary();
  }, [id]);

  return (
    <div className="p-16 mt-4 sm:px-16 lg:px-20 relative">
      <Navbar/>
      <h2 className='font-montserrat font-medium text-center text-3xl'>Trip To {data.destination_location}</h2>
      <TripDetails tripData={data}/>
    </div>
  )
}

export default ItineraryDetails;