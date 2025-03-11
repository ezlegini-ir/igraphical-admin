"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { enrollmentStatus } from "@/lib/validationSchema";

const FormSchema = z.object({
  enrollmentStatus: z.enum(enrollmentStatus),
});

function EnrollmentStatusForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enrollmentStatus: "PENDING",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="enrollmentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Update Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {enrollmentStatus.map((item, index) => (
                    <SelectItem key={index} value={item} className="capitalize">
                      <span
                        className={`capitalize ${item === "PENDING" ? "text-orange-400" : item === "IN_PROGRESS" ? "text-primary" : "text-green-500"}`}
                      >
                        {item.toLowerCase()}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default EnrollmentStatusForm;
