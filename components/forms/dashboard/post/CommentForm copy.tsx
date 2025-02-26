"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import Error from "@/components/Error";
import Loader from "@/components/Loader";
import { ReviewType } from "@/components/ReviewCard";
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
import { CommentFormType, commentFormSchema } from "@/lib/validationSchema";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
interface Props {
  type: "NEW" | "UPDATE";
  review?: ReviewType;
}

const CommentForm = ({ type, review }: Props) => {
  // HOOKS
  const router = useRouter();
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();
  const { success, setSuccess } = useSuccess();

  const isUpdateType = type === "UPDATE";

  const form = useForm<CommentFormType>({
    resolver: zodResolver(commentFormSchema),
    mode: "onSubmit",
    defaultValues: {
      content: "",
      course: "",
      date: new Date(),
      rate: "5",
      user: "",
    },
  });

  const onSubmit = async (data: CommentFormType) => {
    setError("");
    setLoading(true);

    console.log(data);

    form.reset();
    router.refresh();
    setSuccess("Created Successfully");
    setLoading(false);
  };

  const onDelete = (id: number) => {
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
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">
                    علیرضا ازلگینی - ezlegini.ir@gmail.com
                  </SelectItem>
                  <SelectItem value="2">
                    علیرضا ازلگینی - ezlegini.ir@gmail.com
                  </SelectItem>
                  <SelectItem value="3">
                    علیرضا ازلگینی - ezlegini.ir@gmail.com
                  </SelectItem>
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
                    <SelectValue placeholder="Select a course..." />
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
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Rating..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">
                    {Array.from({ length: 1 }).map((_, index) => (
                      <Star
                        key={index}
                        className="text-yellow-500"
                        fill="#eab308"
                        size={14}
                      />
                    ))}
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="flex gap-1">
                      {Array.from({ length: 2 }).map((_, index) => (
                        <Star
                          key={index}
                          className="text-yellow-500"
                          fill="#eab308"
                          size={14}
                        />
                      ))}
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Star
                          key={index}
                          className="text-yellow-500"
                          fill="#eab308"
                          size={14}
                        />
                      ))}
                    </div>
                  </SelectItem>
                  <SelectItem value="4">
                    <div className="flex gap-1">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <Star
                          key={index}
                          className="text-yellow-500"
                          fill="#eab308"
                          size={14}
                        />
                      ))}
                    </div>
                  </SelectItem>
                  <SelectItem value="5">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className="text-yellow-500"
                          fill="#eab308"
                          size={14}
                        />
                      ))}
                    </div>
                  </SelectItem>
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

        <Button
          disabled={!form.formState.isValid || loading}
          className="w-full flex gap-2"
          type="submit"
        >
          {<Loader loading={loading} />}
          {isUpdateType ? "Update" : "Create"}
        </Button>

        {/* {isUpdateType && (
          <DeleteButton id={review?.id!} onDelete={onDelete} />
        )} */}
        <Error error={error} />
        <Success success={success} />
      </form>
    </Form>
  );
};

export default CommentForm;

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;
