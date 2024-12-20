import React from "react";
import { z } from "zod";
import Auth from "../../components/auth/auth";

const Signup = () => {
  const handleSignUp = (data) => {
    console.log("Signup Data:", data);
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
      footerButton="Signin"
      footerLink='/signin'
    />
  );
};

export default Signup;