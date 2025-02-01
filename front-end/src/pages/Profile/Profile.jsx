import api from "@/api/interceptor";
import { Navbar } from "@/components/Navbar";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setUser } from "@/redux/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";

const formTemplate = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  userName: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(true);
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formTemplate),
    defaultValues: {
      firstName: userInfo?.first_name || "",
      lastName: userInfo?.last_name || "",
      userName: userInfo?.username || "",
      email: userInfo?.email || "",
    },
  });

  useEffect(() => {
    if (userInfo) {
      form.reset({
        firstName: userInfo.first_name || "",
        lastName: userInfo.last_name || "",
        userName: userInfo.username || "",
        email: userInfo.email || "",
      });
      setLoading(false);
    }
  }, [userInfo]);

  const handleEdit = () => {
    setEdit(false);
    form.reset({
      firstName: userInfo?.first_name || "",
      lastName: userInfo?.last_name || "",
      userName: userInfo?.username || "",
      email: userInfo?.email || "",
    });
  };

  const onSubmit = async (data) => {
    try {
      const response = await api.patch("/api/users/me/", {
        first_name: data.firstName,
        last_name: data.lastName,
        username: data.userName,
        email: data.email,
      });
      dispatch(setUser(response.data));
      toast.success("User Info Updated Successfully!");
      setEdit(true);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update user info");
    }
  };

  if (loading) {
    return (
      <p className="flex justify-center items-center min-h-screen text-3xl">
        Loading...
      </p>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center overflow-x-hidden">
      <Navbar />
      <div className="m-16 mt-24 flex flex-col md:flex-row gap-8 md:gap-16 w-full mx-4 md:mx-20 justify-center items-center">
        <div className="flex justify-center items-center">
          <Avatar className="bg-gold flex justify-center items-center uppercase w-52 h-52 text-6xl">
            {userInfo?.first_name?.charAt(0) || "P"}
          </Avatar>
        </div>

        <div className="md:w-3/5 m-0 w-4/5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="firstName" className="text-lg">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={edit}
                        id="firstName"
                        placeholder="Enter your first name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="lastName" className="text-lg">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={edit}
                        id="lastName"
                        placeholder="Enter your last name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="userName" className="text-lg">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={edit}
                        id="userName"
                        placeholder="Enter your username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email" className="text-lg">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={edit}
                        id="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {edit ? (
                <Button variant="gold" onClick={handleEdit} type="button">
                  Edit
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Button variant="gold" type="submit">
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setEdit(true)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Profile;