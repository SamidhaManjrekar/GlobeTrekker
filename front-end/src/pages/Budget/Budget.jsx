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
import React, { useEffect, useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import api from "@/api/interceptor";
import { format } from "date-fns";

const FormSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  category: z.string().nonempty("Please select a spending category"),
  description: z.string().nonempty("Description is required"),
  payment_method: z.string().nonempty("Select a payment method"),
});

const Budget = ({id}) => {
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
    defaultValues: { amount: "", category: "", description: "", payment_method: "" },
  });


  const onSubmit = async (data) => {
    const formattedDate = format(new Date(), "yyyy-MM-dd"); 
    data = { ...data, itinerary: id, date: formattedDate };
  
    try {
      await api.post(`api/itineraries/${id}/expenses/`, data);
    } catch (e) {
      console.log(e.message);
    }
  
    setSpendings([...spendings, data]); 
    setBudgetUsed((prev) => prev + Number(data.amount));
    reset();
  };

  useEffect(() => {
    const fetchExpenses = async() => {
      try{
        const res = await api.get(`api/itineraries/${id}/expenses/`);
        console.log("data",res.data);
        setSpendings(res.data);
      }catch(e){
        console.log(e.message);
      }
    }

    fetchExpenses();
  }, [])
  

  return (
    <div className="mt-14">
      <div className="mb-6">
        <div className="flex justify-between text-lg font-montserrat">
          <div>Budget Used: ${budgetUsed}</div>
          <div>Budget Remaining: ${totalBudget - budgetUsed}</div>
        </div>
        <Progress value={(budgetUsed / totalBudget) * 100} />
      </div>

      {spendings.length > 0 && (
        <div>
          <h3 className="text-center mt-16 font-light mb-5 text-3xl">
            Spendings till now
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spendings.map((spending, index) => (
                <TableRow key={index}>
                  <TableCell>{spending.date}</TableCell>
                  <TableCell>${spending.amount}</TableCell>
                  <TableCell>{spending.category}</TableCell>
                  <TableCell>{spending.description}</TableCell>
                  <TableCell>{spending.payment_method}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <h3 className="text-center mt-16 font-light mb-5 text-3xl">
        Add Spendings
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-main">Amount</label>
            <Input
              category="number"
              placeholder="Enter amount"
              {...register("amount")}
            />
            <p className="text-red-500 text-sm">{errors.amount?.message}</p>
          </div>

          <div>
            <label className="text-main">Spending Category</label>
            <Select onValueChange={(value) => setValue("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Spending category" />
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
            <p className="text-red-500 text-sm">{errors.category?.message}</p>
          </div>

          <div>
            <label className="text-main">Description</label>
            <Input
              category="text"
              placeholder="Short description"
              {...register("description")}
            />
            <p className="text-red-500 text-sm">
              {errors.description?.message}
            </p>
          </div>

          <div>
            <label className="text-main">Payment Method</label>
            <Select onValueChange={(value) => setValue("payment_method", value)}>
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
              {errors.payment_method?.message}
            </p>
          </div>
        </div>

        <div className="flex justify-center group mt-8">
          <Button variant="gold" category="submit" className="px-5">
            Add Spending
            <ArrowRightIcon className="h-6 w-6 transition duration-300 ease-in-out group-hover:translate-x-1" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Budget;
