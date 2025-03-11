"use client";

import DateField from "@/components/DateField";
import SearchCourses from "@/components/SearchCourses";
import SearchUsers from "@/components/SearchUsers";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { EnrollmentFormType, paymentStatus } from "@/lib/validationSchema";
import { Plus, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { getAllCoursesByIds as getCoursesByIds } from "@/data/course";
import { getUserById } from "@/data/user";
import { enrollmentFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import useLoading from "@/hooks/useLoading";
import Loader from "@/components/Loader";

const EnrollmentSteps = () => {
  // HOOKS
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<Course[] | undefined>(
    undefined
  );
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const { loading: applyDiscountLoading, setLoading: setApplyDiscountLoading } =
    useLoading();

  const form = useForm<EnrollmentFormType>({
    resolver: zodResolver(enrollmentFormSchema),
    defaultValues: {
      courses: [{ courseId: 0 }],
      discountAmount: 0,
      discountCode: "",
      enrolledAt: new Date(),
      paymentMethod: "ADMIN",
      status: "PENDING",
      total: 0,
      itemsTotal: 0,
      userId: 0,
    },
  });

  const applyDiscount = () => {
    setApplyDiscountLoading(true);

    const discountCode = form.getValues("discountCode");

    if (!discountCode) {
      toast.error("Invalid Discount Code");
      setApplyDiscountLoading(false);
      return;
    }

    //TODO: Fetch Code from DB
    const discountAmount = 100_000;

    setDiscountAmount(discountAmount);
    setDiscountCode(discountCode); //todo
    form.setValue("total", form.getValues("total") - discountAmount);

    setApplyDiscountLoading(false);
    toast.success("Discount Applied");
  };

  const removeDiscount = () => {
    form.setValue("discountCode", "");
    form.setValue("total", form.getValues("total") + discountAmount);
    setDiscountCode("");
    setDiscountAmount(0);
  };

  const { append, remove, fields } = useFieldArray({
    name: "courses",
    control: form.control,
  });

  const onSubmit = (data: EnrollmentFormType) => {
    console.log(data);
    toast.success("Created Successfully");
  };

  const userId = form.getValues("userId");

  useEffect(() => {
    const fetchSelectedUser = async () => {
      if (userId) {
        const user = await getUserById(userId);
        setSelectedUser(user ? user : undefined);
      }
    };

    fetchSelectedUser();
  }, [userId]);

  const watchedCourses = form.watch("courses");
  const courseIds = watchedCourses.map((c) => c.courseId);

  useEffect(() => {
    const fetchSelectedCourses = async () => {
      if (courseIds.length > 0) {
        const courses = await getCoursesByIds(courseIds);
        setSelectedCourses(courses || undefined);
      } else {
        setSelectedCourses(undefined);
      }
    };
    fetchSelectedCourses();
  }, [JSON.stringify(courseIds)]);

  useEffect(() => {
    const itemsTotal =
      selectedCourses?.reduce((acc, curr) => acc + curr.price, 0) || 0;
    form.setValue("itemsTotal", itemsTotal);
    form.setValue("total", itemsTotal);
  }, [selectedCourses, form]);

  const totalPrice = form.getValues("total");
  const itemsTotal = form.getValues("itemsTotal");

  useEffect(() => {
    const discountAmount = itemsTotal - totalPrice;
    form.setValue("discountAmount", discountAmount > 0 ? -discountAmount : 0);
  }, [totalPrice, itemsTotal]);

  return (
    <div className="space-y-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <h3>Create New Enrollment</h3>

          <div className="grid gap-5 grid-cols-12">
            <div className="col-span-9 space-y-3">
              <div className="card flex gap-3 items-end">
                {/* //! User */}
                <FormField
                  control={form.control}
                  name={"userId"}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>User</FormLabel>
                      <SearchUsers
                        field={field}
                        placeHolder="Search Users..."
                        userId={userId}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* //! Date */}
                <div className="w-full">
                  <DateField form={form} />
                </div>
              </div>

              {/* //! Course */}
              <FormItem>
                <div className="card">
                  <div className="w-full space-y-4">
                    {fields.map((arrayField, index) => (
                      <div key={arrayField.id}>
                        <div className="flex items-end gap-2">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.courseId`}
                            render={({ field }) => (
                              <FormItem className="overflow-visible w-full">
                                <FormLabel>Course {index + 1}</FormLabel>
                                <SearchCourses
                                  field={field}
                                  courseId={courseIds[index]}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={form.getValues("courses")?.length === 1}
                            onClick={() => remove(index)}
                          >
                            <Trash className="text-gray-400" size={16} />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size={"icon"}
                            onClick={() =>
                              append({
                                courseId: 0,
                              })
                            }
                          >
                            <Plus className="text-gray-400" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            </div>

            <div className="card w-full col-span-3 h-min space-y-5">
              {/* //! Payment Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status for payment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentStatus.map((status, index) => (
                          <SelectItem key={index} value={status}>
                            <span
                              className={`capitalize font-medium ${
                                status === "SUCCESS"
                                  ? "text-green-600"
                                  : status === "PENDING"
                                    ? "text-yellow-500"
                                    : status === "CANCELED"
                                      ? "text-gray-500"
                                      : "text-red-500"
                              }`}
                            >
                              {status.toLocaleLowerCase()}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  {/* //! Discount Code */}
                  <FormField
                    control={form.control}
                    name="discountCode"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Discount Code</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              disabled={!!discountCode}
                              className={`${discountCode && "pl-9"}`}
                            />
                            {discountAmount !== 0 && (
                              <Button
                                size={"icon"}
                                type="button"
                                onClick={removeDiscount}
                                variant={"link"}
                                className="absolute top-0 left-0"
                              >
                                <X />
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    disabled={!!discountCode}
                    onClick={applyDiscount}
                    variant={"outline"}
                  >
                    <Loader loading={applyDiscountLoading} />
                    Apply
                  </Button>
                </div>
              </div>

              {/* //! Total */}
              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total</FormLabel>
                    <FormControl>
                      <Input
                        min={0}
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? 0 : Number(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* //! Info */}
              <ul className="space-y-4 text-sm">
                {selectedUser && (
                  <>
                    <li className="flex justify-between">
                      <span className="font-medium">User</span>
                      <span className="text-gray-500">
                        {selectedUser.fullName}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">Phone</span>
                      <span className="text-gray-500">
                        {selectedUser.phone}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">Email</span>
                      <span className="text-gray-500">
                        {selectedUser.email.toLowerCase()}
                      </span>
                    </li>
                    <Separator />
                  </>
                )}
                <li className="flex justify-between">
                  <span className="font-medium">Items Totals</span>
                  <span>
                    {form.watch("itemsTotal").toLocaleString("en-US")}
                  </span>
                </li>
                <li className="flex justify-between text-gray-500">
                  <span className="font-medium">Discount</span>
                  <span>
                    {form.watch("discountAmount")?.toLocaleString("en-US")}
                  </span>
                </li>
                <Separator />
                <li>
                  <Badge
                    variant={"blue"}
                    className="flex justify-between py-3 text-sm"
                  >
                    <span className="font-semibold">Payable (T)</span>
                    <span className="font-semibold">
                      {form.watch("total")?.toLocaleString("en-US")}
                    </span>
                  </Badge>
                </li>
              </ul>

              <Button disabled={!form.formState.isValid} className="w-full">
                Create
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EnrollmentSteps;
