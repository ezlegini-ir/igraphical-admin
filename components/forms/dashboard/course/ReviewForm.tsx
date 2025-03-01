"use client";

import { ReviewType } from "@/app/(DASHBOARD)/courses/reviews/ReviewsList";
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
import { ReviewFormType, reviewFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface Props {
  type: "NEW" | "UPDATE";
  review?: ReviewType;
}

const ReviewForm = ({ type, review }: Props) => {
  // HOOKS
  const router = useRouter();
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();
  const { success, setSuccess } = useSuccess();

  const isUpdateType = type === "UPDATE";

  const form = useForm<ReviewFormType>({
    resolver: zodResolver(reviewFormSchema),
    mode: "onSubmit",
    defaultValues: {
      content: review?.content || "",
      rate: review?.rate.toString() || "5",
      course: review?.course.id.toString() || "",
      date: review?.createdAt || new Date(),
      user: review?.user.id.toString() || "",
    },
  });

  const onSubmit = async (data: ReviewFormType) => {
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Post..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SelectItem key={index} value={(index + 1).toString()}>
                      <div className="flex gap-1">
                        {Array.from({ length: index + 1 }).map((_, index) => (
                          <Star
                            key={index}
                            size={15}
                            className="text-yellow-400"
                            fill="#facc15"
                          />
                        ))}
                      </div>
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
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Post..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">
                    دوره جامع نرم افزار ادوبی ایلوستریتور
                  </SelectItem>
                  <SelectItem value="2">
                    دوره جامع نرم افزار ادوبی ایلوستریتور
                  </SelectItem>
                  <SelectItem value="3">
                    دوره جامع نرم افزار ادوبی ایلوستریتور
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Post..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">علیرضا ازلگینی</SelectItem>
                  <SelectItem value="2">مهمان</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal en-digits",
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
                    className="en-digits"
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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

        {isUpdateType && <DeleteButton id={review?.id!} onDelete={onDelete} />}
        <Error error={error} />
        <Success success={success} />
      </form>
    </Form>
  );
};

export default ReviewForm;
