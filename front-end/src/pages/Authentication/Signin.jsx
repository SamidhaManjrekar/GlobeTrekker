import Auth from "../../components/auth/Auth";
import { z } from "zod";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/access";
import api from "@/api/interceptor";
import { toast } from "sonner";
import { useDispatch } from "react-redux";  
import { setUser } from "@/redux/userSlice"; 

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();  

  const handleLogin = async (data) => {
    try {
      const res = await api.post("/api/signin/", data);
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      const createTrip = localStorage.getItem("CreateTrip");
      if (createTrip && createTrip.length > 0) {
        const tripData = JSON.parse(createTrip);
        localStorage.removeItem("CreateTrip");
        navigate("/show-trip", { state: { data: tripData } });
      } else {
        navigate("/home");
      }
      const userInfo = await api.get("/api/users/me/");
      dispatch(setUser(userInfo.data)); 
      toast.success("Login successful! Welcome back.");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed! Please check your credentials.");
    }
  };

  const formFields = [
    {
      name: "username",
      type: "text",
      placeholder: "Enter your username",
      validation: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .regex(
          /^[a-zA-Z0-9_.-]+$/,
          "Username can only contain letters, numbers, underscores, hyphens, and periods"
        ),
    },
    {
      name: "password",
      type: "password",
      placeholder: "Enter your password",
      validation: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password cannot be longer than 20 characters")
        .trim(),
    },
  ];

  return (
    <Auth
      formTitle="Welcome Back"
      formDescription="Log in to continue your journey with GlobeTrekker."
      formFields={formFields}
      onSubmit={handleLogin}
      buttonText="Login"
      footerText="Don't have an account?"
      footerButton="Signup"
      footerLink="/signup"
    />
  );
};

export default Signin;