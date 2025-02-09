import api from "@/api/interceptor";
import { Navbar } from "@/components/Navbar";
import TripDetails from "@/components/Trip/TripDetails";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Budget from "../Budget/Budget";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

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
  const [budget, setBudget] = useState("0.00");
  const [isBudgetAlertOpen, setIsBudgetAlertOpen] = useState(false);

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
        setBudget(formattedData.total_budget);
        if (formattedData.total_budget === "0.00") {
          setIsBudgetAlertOpen(true);
        }
      } catch (error) {
        console.error("Error fetching itinerary:", error);
      }
    };
    fetchItinerary();
  }, [id]);

  const handleSetBudget = async() => {
    try{
      const res = await api.patch(`/api/itineraries/budget/${id}/`, { total_budget: budget });
      console.log(res.data);
      setIsBudgetAlertOpen(false);
    }catch(error){
      console.log(error.message);
    }
  };

  return (
    <div className="p-16 mt-4 sm:px-16 lg:px-20 relative">
      <Navbar />
      <h2 className="font-montserrat font-medium text-center text-3xl mb-12">
        Trip To {data.destination_location}
      </h2>

      {isBudgetAlertOpen && (
        <AlertDialog open={isBudgetAlertOpen} onOpenChange={setIsBudgetAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Set Your Trip Budget</AlertDialogTitle>
              <AlertDialogDescription>
                Your budget is currently set to $0.00. Please enter your budget to continue.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-center items-center">
              $
              <Input 
                type="number" 
                placeholder="Enter your budget" 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSetBudget}>Set Budget</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Tabs defaultValue="itinerary">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        <TabsContent value="itinerary">
          <div className="mt-10">
            <TripDetails tripData={data} />
            <div className="flex justify-center group">
              <Button
                className="mt-7 px-10 flex print:hidden"
                variant="gold"
                onClick={handleDownload}
              >
                Download
                <ArrowRightIcon className="h-6 w-6 transition duration-300 ease-in-out group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="budget">
          <Budget id={id} budget={budget} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ItineraryDetails;