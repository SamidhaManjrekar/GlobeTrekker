import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

const Auth = ({
  formTitle,
  formDescription,
  formFields,
  onSubmit,
  buttonText,
  footerText,
  footerButton,
  footerLink,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object(
        formFields.reduce((acc, field) => {
          acc[field.name] = field.validation;
          return acc;
        }, {})
      )
    ),
  });

  return (
    <div className="flex justify-center items-center h-screen ">
      <Card className="w-full max-w-md border-2 border-gold">
        <CardHeader>
          <CardTitle className="text-center">{formTitle}</CardTitle>
          <CardDescription className="text-center">
            {formDescription}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {formFields.map(({ name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </label>
                <Input
                  type={type}
                  placeholder={placeholder}
                  {...register(name)}
                />
                {errors[name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[name].message}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button variant="gold" className="w-full" type="submit">
              <Link to="/home" className="w-full h-full flex justify-center items-center">
                {buttonText}
              </Link>
            </Button>
            <div className="flex items-center">
              {footerText && ( <p className="text-center text-sm">{footerText}</p> )}
              <Link to={footerLink}>
                <Button variant="link" className="pl-2">
                  {footerButton}
                </Button>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
