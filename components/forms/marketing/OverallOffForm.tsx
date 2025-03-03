"use client";

import Error from "@/components/Error";
import Loader from "@/components/Loader";
import Success from "@/components/Success";
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
import useError from "@/hooks/useError";
import useLoading from "@/hooks/useLoading";
import useSuccess from "@/hooks/useSuccess";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  OverallOffFormType,
  overallOffFormSchema,
} from "@/lib/validationSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OverallOffForm = () => {
  // HOOKS
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();
  const { success, setSuccess } = useSuccess();

  const form = useForm<OverallOffFormType>({
    resolver: zodResolver(overallOffFormSchema),
    defaultValues: {
      amount: 0,
      expiresAt: new Date(),
    },
  });

  const onSubmit = async (data: OverallOffFormType) => {
    setError("");
    setLoading(true);
    setSuccess("");

    console.log(data);

    setSuccess("SUCCESSFULL");
    setLoading(false);
  };

  return (
    <>
      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (%)</FormLabel>
                <FormControl>
                  <Input
                    min={0}
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiresAt"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 w-full">
                <FormLabel>Expiration Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* //TODO */}
          {/* <FormField
            control={form.control}
            name="includeCourses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Courses Include</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an included course...." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={"1"}>
                      دوره جامع نرم افزار ادوبی ایلستریتور
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <Button
            disabled={
              !form.formState.isValid || !form.formState.isDirty || loading
            }
            className="w-full flex gap-2"
            type="submit"
          >
            {<Loader loading={loading} />}
            Save
          </Button>
          <Error error={error} />
          <Success success={success} />
        </form>
      </Form>
    </>
  );
};

export default OverallOffForm;
