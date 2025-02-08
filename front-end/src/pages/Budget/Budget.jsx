import { Navbar } from "@/components/Navbar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useState } from "react";

const FormSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  type: z.string().nonempty("Please select a spending type"),
  description: z.string().nonempty("Description is required"),
  paymentMethod: z.string().nonempty("Select a payment method"),
});

const Budget = () => {
  const totalBudget = 20200;
  const [spendings, setSpendings] = useState([]);
  const [budgetUsed, setBudgetUsed] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { amount: "", type: "", description: "", paymentMethod: "" },
  });

  const onSubmit = (data) => {
    console.log("data", data);
    console.log("spending", spendings);
    setSpendings([
      ...spendings,
      { ...data, date: new Date().toLocaleDateString() },
    ]);
    setBudgetUsed((prev) => prev + Number(data.amount));
    reset();
  };

  return (
    <div className="p-16 mt-8 sm:px-16 lg:px-20">
      <Navbar />
      <h2 className="text-center font-montserrat text-4xl font-medium mb-10">
        Budget for your trip
      </h2>

      <div className="mb-6">
        <div className="flex justify-between text-lg font-montserrat">
          <div>Budget Used: ${budgetUsed}</div>
          <div>Budget Remaining: ${totalBudget - budgetUsed}</div>
        </div>
        <Progress value={(budgetUsed / totalBudget) * 100} />
      </div>

      <h3 className="text-center mt-16 font-light mb-5 text-3xl">
        Spendings till now
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Payment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {spendings.length > 0 ? (
            spendings.map((spending, index) => (
              <TableRow key={index}>
                <TableCell>{spending.date}</TableCell>
                <TableCell>${spending.amount}</TableCell>
                <TableCell>{spending.type}</TableCell>
                <TableCell>{spending.description}</TableCell>
                <TableCell>{spending.paymentMethod}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="5" className="text-center">
                No spendings recorded yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <h3 className="text-center mt-16 font-light mb-5 text-3xl">
        Add Spendings
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-main">Amount</label>
            <Input
              type="number"
              placeholder="Enter amount"
              {...register("amount")}
            />
            <p className="text-red-500 text-sm">{errors.amount?.message}</p>
          </div>

          <div>
            <label className="text-main">Spending Type</label>
            <Select onValueChange={(value) => setValue("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Spending Type" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Food",
                  "Transport",
                  "Accommodation",
                  "Entertainment",
                  "Shopping",
                  "Others",
                ].map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-red-500 text-sm">{errors.type?.message}</p>
          </div>

          <div>
            <label className="text-main">Description</label>
            <Input
              type="text"
              placeholder="Short description"
              {...register("description")}
            />
            <p className="text-red-500 text-sm">
              {errors.description?.message}
            </p>
          </div>

          <div>
            <label className="text-main">Payment Method</label>
            <Select onValueChange={(value) => setValue("paymentMethod", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Payment Method" />
              </SelectTrigger>
              <SelectContent>
                {["Cash", "Card", "UPI", "Bank Transfer"].map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-red-500 text-sm">
              {errors.paymentMethod?.message}
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="gold" type="submit" className="px-5">
            Add Spending
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Budget;
