"use client";

import Avatar from "@/components/Avatar";
import DateField from "@/components/DateField";
import SearchCourses from "@/components/SearchCourses";
import SearchUsers from "@/components/SearchUsers";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getAllCoursesByIds as getCoursesByIds } from "@/data/course";
import { getUserById } from "@/data/user";
import { formatPrice } from "@/lib/utils";
import { EnrollmentFormType } from "@/lib/validationSchema";
import { placeHolder } from "@/public";
import { User } from "@prisma/client";
import { Pencil, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { CourseType, PaymentType } from "./PaymentForm";

interface Props {
  form: UseFormReturn<EnrollmentFormType>;
  prices: { price: number }[] | undefined;
  setPrices: Dispatch<
    SetStateAction<{ price: number; originalPrice: number }[] | undefined>
  >;
  setSelectedUser: Dispatch<SetStateAction<User | undefined>>;
  setSelectedCourses: Dispatch<SetStateAction<CourseType[] | undefined>>;
  selectedCourses: CourseType[] | undefined;
  type: "NEW" | "UPDATE";
  payment?: PaymentType;
}

const PaymentFormBody = ({
  form,
  prices,
  setPrices,
  setSelectedUser,
  selectedCourses,
  setSelectedCourses,
  type,
  payment,
}: Props) => {
  const isUpdateType = type === "UPDATE";

  // HOOKS
  const [inputIndex, setInputIndex] = useState<number | undefined>();

  const { append, remove, fields } = useFieldArray({
    name: "courses",
    control: form.control,
  });

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

  //! setSelectedCourse + setPrices
  useEffect(() => {
    const itemsTotal = prices?.reduce((acc, curr) => acc + curr.price, 0) || 0;
    form.setValue("payment.total", itemsTotal);
  }, [prices, form]);

  const watchedCourses = form.watch("courses");
  const courseIds = watchedCourses?.map((c) => c.courseId);

  useEffect(() => {
    const fetchSelectedCourses = async () => {
      if (courseIds.length > 0) {
        const courses = await getCoursesByIds(courseIds);
        const orderedCourses = courseIds
          .map((courseId) => courses.find((course) => course.id === courseId))
          .filter((course): course is CourseType => course !== undefined);

        setSelectedCourses(orderedCourses);
        setPrices(
          orderedCourses.map((course) => ({
            price: course.price,
            originalPrice: course.price,
          }))
        );
      } else {
        setSelectedCourses(undefined);
        setPrices([]);
      }
    };
    fetchSelectedCourses();
  }, [JSON.stringify(courseIds)]);

  return (
    <div className="col-span-9 space-y-3">
      <div className="card flex gap-3 items-end">
        {/* //! User */}
        <FormField
          control={form.control}
          name={"userId"}
          render={({ field }) => (
            <FormItem
              className={`w-full ${isUpdateType && "pointer-events-none"}`}
            >
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
                                <span>{selectedCourses[index]?.title}</span>
                                <span className="text-xs text-gray-500 flex items-center gap-2">
                                  <Avatar
                                    src={
                                      selectedCourses[index]?.tutor?.image?.url
                                    }
                                    size={16}
                                  />
                                  {selectedCourses[index]?.tutor?.name}
                                </span>
                              </div>
                            </div>

                            <div className="flex space-x-14">
                              <div className="flex flex-col items-end">
                                <span className="text-xs text-gray-500">
                                  Original Price
                                </span>
                                <span className="text-gray-500 text-right">
                                  {formatPrice(
                                    payment
                                      ? payment.enrollment[index]
                                          .courseOriginalPrice
                                      : selectedCourses[index].price,
                                    { showNumber: true }
                                  )}
                                </span>
                              </div>

                              <div className="flex flex-col items-end">
                                <span className="text-xs text-gray-500">
                                  Final Price
                                </span>
                                <span
                                  className={`border-b flex items-center gap-0.5 ${isUpdateType && "pointer-events-none opacity-50"}`}
                                >
                                  <div
                                    onClick={() => setInputIndex(index)}
                                    className="cursor-pointer p-1 group"
                                  >
                                    <Pencil
                                      size={12}
                                      className="text-gray-500 group-hover:text-black"
                                    />
                                  </div>
                                  <input
                                    disabled={index !== inputIndex}
                                    title="Do Not Touch This Unless You Have to."
                                    className="w-[100px] disabled:text-gray-500 disabled:bg-transparent"
                                    type="number"
                                    value={
                                      payment?.enrollment[index].price ||
                                      prices?.[index]?.price
                                    }
                                    onChange={(e) => {
                                      const newPrice = Number(e.target.value);

                                      setPrices((prevPrices) => {
                                        if (!prevPrices) {
                                          return (
                                            selectedCourses?.map(
                                              (course, idx) => ({
                                                price:
                                                  idx === index
                                                    ? newPrice
                                                    : course.price,
                                                originalPrice: course.price,
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
                                </span>
                              </div>
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
                                <Trash className="text-gray-400" size={16} />
                              </Button>
                            </div>
                          </div>
                        )}

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {selectedCourses?.[index] && !isUpdateType && (
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

            {!isUpdateType && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const courseIds = form
                    .watch("courses")
                    .map((c) => c.courseId);

                  // Check if the course is already selected
                  if (courseIds.includes(0)) {
                    toast.info("Try to add a course first...");
                    return;
                  }

                  append({
                    courseId: 0,
                    price: 0,
                    originalPrice: 0,
                  });
                }}
                className="my-3"
              >
                <Plus className="text-gray-400" size={16} />
                Add Course
              </Button>
            )}
          </div>
        </div>
        <FormMessage />
      </FormItem>
    </div>
  );
};

export default PaymentFormBody;
