"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, isBefore } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// 🧠 Validation Schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dateRange: z
    .object({
      from: z.date().nullable(),
      to: z.date().nullable(),
    })
    .refine((data) => data.from && data.to, {
      message: "Date range is required",
      path: ["from"],
    }),
});

// 🎲 Form Values Type
type FormValues = z.infer<typeof formSchema>;

export default function FormWithDateRange() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dateRange: {
        from: new Date(),
        to: addDays(new Date(), 7),
      },
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* 📝 Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 📅 Date Range Picker Field */}
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Range</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[300px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value?.from ? (
                      field.value.to ? (
                        <>
                          {format(field.value.from, "LLL dd, y")} -{" "}
                          {format(field.value.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(field.value.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    selected={field.value}
                    onSelect={(date) => field.onChange(date)}
                    numberOfMonths={2}
                    disabled={(date) => isBefore(date, new Date())} // 🛠️ Disable past dates
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 🚀 Submit Button */}
        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </Form>
  );
}
