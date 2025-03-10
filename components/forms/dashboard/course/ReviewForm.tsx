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
import { getCourseById } from "@/data/course";
import { searchCourses, searchUsers } from "@/data/search";
import { getUserById } from "@/data/user";
import useError from "@/hooks/useError";
import useLoading from "@/hooks/useLoading";
import useSuccess from "@/hooks/useSuccess";
import { cn } from "@/lib/utils";
import { ReviewFormType, reviewFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course, User } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SearchField from "../../SearchField";
import { createReview, deleteReview, updateReview } from "@/actions/review";

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
      courseId: review?.course.id || 0,
      userId: review?.user.id || 0,
      date: review?.createdAt || new Date(),
    },
  });

  const onSubmit = async (data: ReviewFormType) => {
    setError("");
    setLoading(true);

    const res = isUpdateType
      ? await updateReview(data, review?.id!)
      : await createReview(data);

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      setSuccess(res.success);
      router.refresh();
      setLoading(false);
    }
  };

  const onDelete = async () => {
    const res = await deleteReview(review?.id!);

    if (res.error) {
      setError(res.error);
      return;
    }

    router.refresh();
  };

  //! SEARCH UTILS
  //HOOKS
  const [defaultUser, setDefaultUser] = useState<User | undefined>(undefined);

  const fetchUsers = async (query: string): Promise<User[]> => {
    return await searchUsers(query);
  };
  const [defaultCourse, setDefaultCourse] = useState<Course | undefined>(
    undefined
  );

  const fetchCourses = async (query: string): Promise<Course[]> => {
    return await searchCourses(query);
  };

  useEffect(() => {
    const fetchSelectedCourse = async () => {
      if (review?.courseId) {
        const course = await getCourseById(review.courseId);
        setDefaultCourse(course ? course : undefined);
      }
    };
    fetchSelectedCourse();
  }, [review?.courseId]);

  useEffect(() => {
    const fetchSelectedUser = async () => {
      if (review?.userId) {
        const user = await getUserById(review.userId);
        setDefaultUser(user ? user : undefined);
      }
    };
    fetchSelectedUser();
  }, [review?.userId]);

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
                <Textarea dir="rtl" {...field} />
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
          name="courseId"
          render={({ field }) => (
            <FormItem className="overflow-visible">
              <FormLabel>Course</FormLabel>

              <SearchField<Course>
                placeholder="Search Courses..."
                fetchResults={fetchCourses}
                onSelect={(course) =>
                  course ? field.onChange(course.id) : field.onChange(undefined)
                }
                getItemLabel={(course) => `${course.title}`}
                defaultItem={defaultCourse}
              />

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem className="overflow-visible">
              <FormLabel>User</FormLabel>

              <SearchField<User>
                placeholder="Search Users..."
                fetchResults={fetchUsers}
                onSelect={(user) =>
                  user ? field.onChange(user.id) : field.onChange(undefined)
                }
                getItemLabel={(user) => `${user.fullName} - ${user.email}`}
                defaultItem={defaultUser}
              />

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
          disabled={
            !form.formState.isValid || !form.formState.isDirty || loading
          }
          className="w-full flex gap-2"
          type="submit"
        >
          {<Loader loading={loading} />}
          {isUpdateType ? "Update" : "Create"}
        </Button>

        {isUpdateType && <DeleteButton onDelete={onDelete} />}
        <Error error={error} />
        <Success success={success} />
      </form>
    </Form>
  );
};

export default ReviewForm;
