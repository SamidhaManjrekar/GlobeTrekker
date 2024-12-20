import Auth from '../../components/auth/Auth';
import { z } from "zod";
import React from 'react';

const Signin = () => {
  const handleLogin = (data) => {
    console.log("Login Data:", data);
  };

  const formFields = [
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
      validation: z.string().min(6, "Password must be at least 6 characters").max(20, "Password cannot be longer than 20 characters").trim(),
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
      footerLink='/signup'
    />
  );
};

export default Signin;