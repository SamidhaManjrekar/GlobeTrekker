import React from "react";
import { z } from "zod";
import Auth from "../../components/auth/auth";
import { useNavigate } from "react-router-dom";
import api from "@/api/interceptor";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/access";

const Signup = () => {
  const navigate = useNavigate();
  const handleSignUp = async (data) => {
    console.log("Signup Data:", data);
    try {
      const res = await api.post("/api/signup/", data);
      navigate("/signin");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const formFields = [
    {
      name: "name",
      type: "text",
      placeholder: "Enter your name",
      validation: z
        .string()
        .min(1, "Name is required")
        .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    },
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
      name: "email",
      type: "email",
      placeholder: "Enter your email",
      validation: z.string().email("Invalid email address"),
    },
    {
      name: "password",
      type: "password",
      placeholder: "Enter your password",
      validation: z.string().min(6, "Password must be at least 6 characters"),
    },
  ];

  return (
    <Auth
      formTitle="Create an Account"
      formDescription="Join GlobeTrekker to plan your adventures effortlessly."
      formFields={formFields}
      onSubmit={handleSignUp}
      buttonText="Sign Up"
      footerText="Already have an account?"
      footerButton="Sign in"
      footerLink="/signin"
    />
  );
};

export default Signup;