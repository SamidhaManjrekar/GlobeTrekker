import React, { useState } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Trash2 } from "lucide-react";
import api from "@/api/interceptor";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

const TripCard = ({ name, startDate, endDate, cities, id, deleteTrip, imageUrl }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await api.delete(`/api/itineraries/${id}/`);
      toast.success("Itinerary deleted successfully!");
      deleteTrip(id); 
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete itinerary");
    }
  };

  return (
    <div>
      <div className="flex gap-5 mt-6">
        <img
          src={ imageUrl || "https://via.placeholder.com/600x400"}
          alt={name}
          className="w-1/3 object-cover rounded-md"
        />
        <div className="flex-grow">
          <h2 className="text-2xl font-montserrat mb-4">{name}</h2>
          <p className="text-gray-400">
            <span className="font-semibold">Dates:</span> {startDate} to {endDate}
          </p>
          <p className="text-gray-400 mb-5">
            <span className="font-semibold">Cities:</span> {cities.join(", ")}
          </p>

          <div className="flex gap-12">
            <Link to={`/itinerary/${id}`}>
              <Button variant="gold" className="group">
                <span>View Details</span>
                <ArrowRightIcon className="h-6 w-6 transition duration-300 ease-in-out group-hover:translate-x-1" />
              </Button>
            </Link>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="gold" className="p-1 px-3 rounded-md">
                  <Trash2 size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;