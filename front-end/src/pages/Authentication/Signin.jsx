import Auth from "../../components/auth/Auth";
import { z } from "zod";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/access";
import api from "@/api/interceptor";

const Signin = () => {
  const navigate = useNavigate();
  const handleLogin = async (data) => {
    console.log("Login Data:", data);
    try {
      const res = await api.post("/api/signin/", data);
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      if (localStorage.getItem("CreateTrip").length === 0) {
        navigate("/home");
      }
      else{
        const data = JSON.parse(localStorage.getItem("CreateTrip"));
        localStorage.removeItem("CreateTrip");
        navigate("/show-trip", { state: { data } });
      }
    } catch (error) {
      console.error("Login failed:", error);
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
