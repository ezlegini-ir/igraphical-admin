"use client";

import DeleteButton from "@/components/DeleteButton";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useError from "@/hooks/useError";
import useLoading from "@/hooks/useLoading";
import useSuccess from "@/hooks/useSuccess";
import { cn } from "@/lib/utils";
import {
  CouponFormType,
  couponFormSchema,
  couponType,
} from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface Props {
  type: "NEW" | "UPDATE";
  coupon?: CouponFormType & { id: number };
}

const CouponForm = ({ type, coupon }: Props) => {
  // HOOKS
  const router = useRouter();
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();
  const { success, setSuccess } = useSuccess();

  const isUpdateType = type === "UPDATE";

  const form = useForm<CouponFormType>({
    resolver: zodResolver(couponFormSchema),
    mode: "onSubmit",
    defaultValues: {
      amount: coupon?.amount || 0,
      coupon: coupon?.coupon || "",
      expiresAt: coupon?.expiresAt || undefined,
      limit: coupon?.limit || 0,
      summery: coupon?.summery || "",
      type: coupon?.type || "FIXED",
    },
  });

  const onSubmit = async (data: CouponFormType) => {
    setError("");
    setLoading(true);

    console.log(data);

    form.reset();
    router.refresh();
    setSuccess("Created Successfully");
    setLoading(false);
  };

  const onDelete = (id: number | string) => {
    console.log("Delete" + id);
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="coupon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coupon</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
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
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limit</FormLabel>
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {couponType?.map((coupun, index) => (
                    <SelectItem key={index} value={coupun}>
                      {coupun}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

        <FormField
          control={form.control}
          name="summery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summery</FormLabel>
              <FormControl>
                <Textarea dir="rtl" className="text-left" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={!form.formState.isValid || loading}
          className="w-full flex gap-2"
          type="submit"
        >
          {<Loader loading={loading} />}
          {isUpdateType ? "Update" : "Create"}
        </Button>

        {isUpdateType && <DeleteButton id={coupon?.id!} onDelete={onDelete} />}
        <Error error={error} />
        <Success success={success} />
      </form>
    </Form>
  );
};

export default CouponForm;
