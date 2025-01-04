import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import createTrip from "../../assets/createTrip.jpg";

const tripSchema = z.object({
  numberOfAdults: z.number().min(0, "Must be a positive number").default(1),
  numberOfChildren: z.number().min(0, "Must be a positive number").default(0),
  source: z.string().min(2, "Source is required"),
  destination: z.string().min(2, "Destination is required"),
  budgetType: z.enum(["Economy", "Standard", "Luxury"], {
    required_error: "Select a budget",
  }),
  departureDate: z.date({ message: "Departure date is required" }),
  returnDate: z.date({ message: "Return date is required" }),
  requirements: z.string().optional(),
});

const CreateTrip = () => {
  const [isSignedIn, setIsSignedIn] = useState(
    !!(localStorage.getItem("access") && localStorage.getItem("refresh"))
  );
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      numberOfAdults: 1,
      numberOfChildren: 0,
      source: "",
      destination: "",
      budgetType: "Economy",
      departureDate: undefined,
      returnDate: undefined,
      requirements: "",
    },
  });

  const onSubmit = async (data) => {
    if (isSignedIn) {
      navigate("/show-trip", { state: { data } });
    } else {
      localStorage.setItem("CreateTrip", JSON.stringify(data));
      navigate("/signin");
    }
  };

  const handleSignInSuccess = () => {
    setIsSignedIn(true);
    navigate("/show-trip", { state: { data: form.getValues() } });
  };

  return (
    <>
      <Navbar />
      <div className="p-12 pt-14 max-w-3xl mx-auto space-y-6">
        <img
          src={createTrip}
          alt="home image"
          className="absolute top-0 left-0 w-full h-[800px] object-cover object-center z-[-1]"
        />
        <div className="absolute top-0 left-0 w-full h-[850px] bg-custom-gradient z-[-1]" />
        <h1 className="text-3xl font-bold text-center">
          Plan Your Dream Vacation
        </h1>
        <p className="text-center text-lg">
          Tell us a little about your choices
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-10">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="numberOfAdults"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-main">
                        Number of Adults (13+)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter adults"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="numberOfChildren"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-main">
                        Number of Children
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter children"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main">Traveling From</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter source" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main">Traveling To</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter destination" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budgetType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main">Budget</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-10"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Economy" id="economy" />
                        <label htmlFor="economy">Economy</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Standard" id="standard" />
                        <label htmlFor="standard">Standard</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Luxury" id="luxury" />
                        <label htmlFor="luxury">Luxury</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-10">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="departureDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-main">
                        Departure Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline2"
                            className={`w-full justify-start ${
                              !field.value
                                ? "text-muted-foreground"
                                : "text-main"
                            }`}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() ||
                              (form.getValues("returnDate") &&
                                date > form.getValues("returnDate"))
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="returnDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-main">Return Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline2"
                            className={`w-full justify-start ${
                              !field.value
                                ? "text-muted-foreground"
                                : "text-main"
                            }`}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() ||
                              (form.getValues("departureDate") &&
                                date < form.getValues("departureDate"))
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific Requirements</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter any requirements" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center align-middle">
              <Button type="submit" variant="gold" className="px-8">
                Plan Trip
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default CreateTrip;