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

import { createEnrollment } from "@/actions/enrollment";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";
import { getAllCoursesByIds as getCoursesByIds } from "@/data/course";
import { getUserById } from "@/data/user";
import useLoading from "@/hooks/useLoading";
import { enrollmentFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course, Image as ImageType, Tutor, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { placeHolder } from "@/public";
import Avatar from "@/components/Avatar";
import { getCouponByCode } from "@/data/coupon";
import { useRouter } from "next/navigation";

interface CourseType extends Course {
  image: ImageType | null;
  tutor: (Tutor & { image: ImageType | null }) | null;
}

const EnrollmentSteps = () => {
  // HOOKS
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const { loading, setLoading } = useLoading();
  const router = useRouter();
  const [selectedCourses, setSelectedCourses] = useState<
    CourseType[] | undefined
  >();
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const { loading: applyDiscountLoading, setLoading: setApplyDiscountLoading } =
    useLoading();
  const [prices, setPrices] = useState<{ price: number }[]>();

  //! MANAGE FORM

  const form = useForm<EnrollmentFormType>({
    resolver: zodResolver(enrollmentFormSchema),
    defaultValues: {
      courses: [{ courseId: 0, price: 0 }],
      enrolledAt: new Date(),
      userId: 0,
      payment: {
        discountAmount: 0,
        discountCode: "",
        paymentMethod: "ADMIN",
        total: 0,
        itemsTotal: 0,
        status: "SUCCESS",
      },
    },
  });

  const { append, remove, fields } = useFieldArray({
    name: "courses",
    control: form.control,
  });

  const onSubmit = async (data: EnrollmentFormType) => {
    setLoading(true);

    const coursesWithPrices = data.courses.map((course, idx) => ({
      ...course,
      price: prices?.[idx]?.price ?? 0,
    }));
    data.courses = coursesWithPrices;

    if (!itemsTotal) delete data.payment;

    const res = await createEnrollment(data);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      setLoading(false);
      setDiscountCode("");
      router.push("/enrollments/list");
    }
  };

  //! SEARCH FIELDS
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
    const itemsTotal = prices?.reduce((acc, curr) => acc + curr.price, 0) || 0;
    form.setValue("payment.total", itemsTotal);
  }, [prices, form]);

  useEffect(() => {
    const fetchSelectedCourses = async () => {
      if (courseIds.length > 0) {
        const courses = await getCoursesByIds(courseIds);
        setSelectedCourses(courses || undefined);
        setPrices((prevPrices) => {
          if (!prevPrices || prevPrices.length === 0) {
            return courses.map((c) => ({ price: c.price }));
          }
          return courses.map((course, idx) => ({
            price:
              idx < prevPrices.length ? prevPrices[idx].price : course.price,
          }));
        });
      } else {
        setSelectedCourses(undefined);
        setPrices([]);
      }
    };
    fetchSelectedCourses();
  }, [JSON.stringify(courseIds)]);

  //! APPLY DISCOUNT

  useEffect(() => {
    const itemsTotal = prices?.reduce((acc, curr) => acc + curr.price, 0) || 0;
    form.setValue("payment.itemsTotal", itemsTotal);
    form.setValue("payment.total", itemsTotal);
  }, [selectedCourses, form]);

  const totalPrice = form.getValues("payment.total")!;
  const itemsTotal = form.getValues("payment.itemsTotal")!;

  useEffect(() => {
    const discountAmount = itemsTotal - totalPrice;
    form.setValue(
      "payment.discountAmount",
      discountAmount > 0 ? -discountAmount : 0
    );
  }, [totalPrice, itemsTotal]);

  const applyDiscount = async () => {
    setApplyDiscountLoading(true);

    const enteredDiscountCode = form.getValues("payment.discountCode");

    const coupon = await getCouponByCode(enteredDiscountCode);

    if (!coupon) {
      toast.error("Coupon Not Found...");
      setApplyDiscountLoading(false);
      return;
    }

    setDiscountAmount(coupon.amount);
    setDiscountCode(enteredDiscountCode);
    const discountDiff = form.getValues("payment.total")! - coupon.amount;
    form.setValue("payment.total", discountDiff < 0 ? 0 : discountDiff);

    setApplyDiscountLoading(false);
    toast.success("Discount Applied");
  };

  const removeDiscount = () => {
    form.setValue("payment.discountCode", "");
    form.setValue(
      "payment.total",
      form.getValues("payment.total")! + discountAmount
    );
    setDiscountCode("");
    setDiscountAmount(0);
  };

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
                  <div className="w-full">
                    {fields.map((arrayField, index) => (
                      <div key={arrayField.id} className="space-y-6">
                        <div className="flex items-center gap-2">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.courseId`}
                            render={({ field }) => (
                              <FormItem className="w-full border-b last:border-none py-3 flex items-center gap-3">
                                {selectedCourses?.[index] && (
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex gap-2 items-center">
                                      <Image
                                        alt=""
                                        src={
                                          selectedCourses[index]?.image?.url ||
                                          placeHolder
                                        }
                                        width={90}
                                        height={90}
                                        className="rounded-sm object-cover aspect-video"
                                      />

                                      <div className="flex flex-col gap-1">
                                        <span>
                                          {selectedCourses[index]?.title}
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center gap-2">
                                          <Avatar
                                            src={
                                              selectedCourses[index]?.tutor
                                                ?.image?.url
                                            }
                                            size={16}
                                          />
                                          {selectedCourses[index]?.tutor?.name}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                      <span className="text-xs text-gray-500">
                                        Price
                                      </span>
                                      <span className="border-b ">
                                        <input
                                          className="w-[80px]"
                                          type="number"
                                          value={prices?.[index]?.price ?? ""}
                                          onChange={(e) => {
                                            const newPrice = Number(
                                              e.target.value
                                            );

                                            setPrices((prevPrices) => {
                                              if (!prevPrices) {
                                                return (
                                                  selectedCourses?.map(
                                                    (course, idx) => ({
                                                      price:
                                                        idx === index
                                                          ? newPrice
                                                          : course.price,
                                                    })
                                                  ) ?? []
                                                );
                                              }

                                              return prevPrices.map(
                                                (item, priceIndex) =>
                                                  priceIndex === index
                                                    ? {
                                                        ...item,
                                                        price: newPrice,
                                                      }
                                                    : item
                                              );
                                            });
                                          }}
                                        />
                                        T
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {!selectedCourses?.[index] && (
                                  <div className="w-full">
                                    <FormLabel>Course {index + 1}</FormLabel>
                                    <div className="flex gap-3 items-center">
                                      <SearchCourses
                                        field={field}
                                        courseId={courseIds[index]}
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                      >
                                        <Trash
                                          className="text-gray-400"
                                          size={16}
                                        />
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {selectedCourses?.[index] && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <Trash className="text-gray-400" size={16} />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        append({
                          courseId: 0,
                          price: 0,
                        })
                      }
                      className="my-3"
                    >
                      <Plus className="text-gray-400" size={16} />
                      Add Course
                    </Button>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            </div>

            <div className="card w-full col-span-3 h-min space-y-5">
              <div
                className={`${!itemsTotal && "pointer-events-none opacity-50"} space-y-3`}
              >
                {/* //! Payment Status */}
                <FormField
                  control={form.control}
                  name="payment.status"
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
                      name="payment.discountCode"
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
                      disabled={
                        !!discountCode ||
                        !!!form.getValues("payment.discountCode")
                      }
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
                  name="payment.total"
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
                      {form
                        .watch("payment.itemsTotal")
                        ?.toLocaleString("en-US")}
                    </span>
                  </li>
                  <li className="flex justify-between text-gray-500">
                    <span className="font-medium">Discount</span>
                    <span>
                      {form
                        .watch("payment.discountAmount")
                        ?.toLocaleString("en-US")}
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
                        {form.watch("payment.total")?.toLocaleString("en-US")}
                      </span>
                    </Badge>
                  </li>
                </ul>
              </div>
              <Button
                // disabled={!form.formState.isValid || loading}
                className="w-full"
              >
                <Loader loading={loading} />
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
