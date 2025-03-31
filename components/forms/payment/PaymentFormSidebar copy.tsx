"use client";

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
import { X } from "lucide-react";

import { deletePayment } from "@/actions/payment";
import DeleteButton from "@/components/DeleteButton";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { getCouponByCode } from "@/data/coupon";
import useLoading from "@/hooks/useLoading";
import { formatPrice } from "@/lib/utils";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { CourseType, PaymentType } from "./PaymentForm";

interface Props {
  form: UseFormReturn<EnrollmentFormType>;
  type: "NEW" | "UPDATE";
  prices: { price: number; originalPrice: number }[] | undefined;
  setPrices: Dispatch<
    SetStateAction<
      | {
          price: number;
          originalPrice: number;
        }[]
      | undefined
    >
  >;
  selectedUser: User | undefined;
  selectedCourses: CourseType[] | undefined;
  payment?: PaymentType;
}

const PaymentFormSidebar = ({
  form,
  type,
  selectedUser,
  prices,
  selectedCourses,
  payment,
  setPrices,
}: Props) => {
  // HOOKS
  const { loading: applyDiscountLoading, setLoading: setApplyDiscountLoading } =
    useLoading();
  const router = useRouter();

  const [discountCode, setDiscountCode] = useState(payment?.discountCode);

  // CONSTS
  const isUpdateType = type === "UPDATE";

  const form_Total = form.watch("payment.total");
  const form_ItemsTotal = form.watch("payment.itemsTotal");
  const form_DiscountAmount = form.watch("payment.discountAmount");
  const form_DiscountCode = form.watch("payment.discountCode");
  const form_DiscountCodeAmount = form.watch("payment.discountCodeAmount");

  //! UPDATE COURSES PRICE ---------------------------------------------------
  useEffect(() => {
    const itemsTotal = prices?.reduce((acc, curr) => acc + curr.price, 0) || 0;
    form.setValue("payment.itemsTotal", itemsTotal);

    form.setValue("payment.total", itemsTotal - form_DiscountAmount);
  }, [selectedCourses, form]);

  //! UPDATE PRICE ---------------------------------------------------
  useEffect(() => {
    const totalDiscountAmount = form_ItemsTotal - form_Total;

    form.setValue(
      "payment.discountAmount",
      Math.min(form_ItemsTotal, totalDiscountAmount)
    );
  }, [form_Total, form_ItemsTotal]);

  //! APPLY DISCOUNT ---------------------------------------------------

  const applyDiscount = async () => {
    setApplyDiscountLoading(true);

    // COUPON CHECK ---------------
    const existingCoupon = await getCouponByCode(form_DiscountCode);
    if (!existingCoupon) {
      toast.error("Coupon Not Found...");
      setApplyDiscountLoading(false);
      return;
    }

    // DATE CHECK ---------------
    if (existingCoupon.to) {
      const isExpired = existingCoupon.to < new Date();
      if (isExpired) {
        toast.error("Code Has Been Expired");
        setApplyDiscountLoading(false);
        return;
      }
    }
    if (existingCoupon.from) {
      const isNotStarted = existingCoupon.from > new Date();
      if (isNotStarted) {
        toast.error("Code Date Has Not Yet Started");
        setApplyDiscountLoading(false);
        return;
      }
    }

    // LIMIT CHECK ---------------
    if (existingCoupon.limit) {
      const isReachedToLimit = existingCoupon.used === existingCoupon.limit;
      if (isReachedToLimit) {
        toast.error("Code Limit Has Been Reached");
        setApplyDiscountLoading(false);
        return;
      }
    }

    // APPLY DISOCUNT ---------------
    if (
      existingCoupon.courseInclude.length > 0 ||
      existingCoupon.courseExclude.length > 0
    ) {
      //* COURSE INCLUDE CHECK
      if (existingCoupon.courseInclude.length > 0) {
        const selectedCoursesIds = selectedCourses?.map((c) => c.id)!;
        const courseIncludeIds = existingCoupon.courseInclude.map((c) => c.id);

        const isValid = courseIncludeIds.some((id) =>
          selectedCoursesIds.includes(id)
        );

        if (!isValid) {
          toast.error("Selected Courses are not valid for this coupon");
          setApplyDiscountLoading(false);
          return;
        }

        setDiscountCode(existingCoupon.code);

        // Get the valid course IDs from the selected courses.
        const validSelectedCoursesIds = selectedCoursesIds.filter((id) =>
          courseIncludeIds.includes(id)
        );

        // Update prices for valid courses
        const totalValidPrice =
          prices?.reduce((acc, coursePrice, index) => {
            const course = selectedCourses?.[index];
            if (course && validSelectedCoursesIds.includes(course.id)) {
              return acc + coursePrice.price;
            }
            return acc;
          }, 0) || 0;

        const updatedPrices = prices?.map((coursePrice, index) => {
          const course = selectedCourses?.[index];
          if (course && validSelectedCoursesIds.includes(course.id)) {
            if (existingCoupon.type === "FIXED") {
              // For a fixed discount
              const share = coursePrice.price / totalValidPrice;
              const discountShare = existingCoupon.amount * share;
              return {
                ...coursePrice,
                price: coursePrice.price - discountShare,
              };
            } else {
              // For a percentage discount
              return {
                ...coursePrice,
                price: coursePrice.price * (1 - existingCoupon.amount / 100),
              };
            }
          }
          return coursePrice;
        });

        // Update prices state with the new discounted prices.
        setPrices(updatedPrices);
      }

      //* COURSE EXCLUDE CHECK
      if (existingCoupon.courseExclude.length > 0) {
        const selectedCoursesIds = selectedCourses?.map((c) => c.id)!;
        const courseExcludeIds = existingCoupon.courseExclude.map((c) => c.id);

        // Get valid course IDs from selected courses (courses that are NOT excluded)
        const validSelectedCoursesIds = selectedCoursesIds.filter(
          (id) => !courseExcludeIds.includes(id)
        );

        if (validSelectedCoursesIds.length === 0) {
          toast.error("Selected Courses are not valid for this coupon");
          setApplyDiscountLoading(false);
          return;
        }

        setDiscountCode(existingCoupon.code);

        // Update prices for valid courses (those not excluded)
        const totalValidPrice =
          prices?.reduce((acc, coursePrice, index) => {
            const course = selectedCourses?.[index];
            if (course && validSelectedCoursesIds.includes(course.id)) {
              return acc + coursePrice.price;
            }
            return acc;
          }, 0) || 0;

        const updatedPrices = prices?.map((coursePrice, index) => {
          const course = selectedCourses?.[index];
          if (course && validSelectedCoursesIds.includes(course.id)) {
            if (existingCoupon.type === "FIXED") {
              // For a fixed discount, distribute the coupon amount proportionally among valid courses.
              const share = coursePrice.price / totalValidPrice;
              const discountShare = existingCoupon.amount * share;
              return {
                ...coursePrice,
                price: coursePrice.price - discountShare,
              };
            } else {
              // For a percentage discount, apply the discount directly.
              return {
                ...coursePrice,
                price: coursePrice.price * (1 - existingCoupon.amount / 100),
              };
            }
          }
          return coursePrice;
        });

        // Update prices state with the new discounted prices.
        setPrices(updatedPrices);
      }
    } else {
      // APPLY
      setDiscountCode(existingCoupon.code);

      let toReduce: number;
      if (existingCoupon.type === "FIXED") {
        toReduce = existingCoupon.amount;
      } else {
        toReduce = form_Total - form_Total * (1 - existingCoupon.amount / 100);
      }
      form.setValue("payment.discountCodeAmount", toReduce);

      const totalDiscount = form_ItemsTotal - form_Total + toReduce;
      form.setValue(
        "payment.total",
        Math.max(0, form_ItemsTotal - totalDiscount)
      );
    }

    setApplyDiscountLoading(false);
    toast.success(`Discount Applied Successfully`);
  };

  useEffect(() => {
    if (prices && prices.length > 0) {
      const originalPricesSum = prices.reduce(
        (acc, curr) => acc + (curr.originalPrice || 0),
        0
      );
      const updatedPricesSum = prices.reduce(
        (acc, curr) => acc + (curr.price || 0),
        0
      );
      const pricesDiff = originalPricesSum - updatedPricesSum;

      form.setValue("payment.discountCodeAmount", pricesDiff, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [prices]);

  //!REMOVE DISCOUNT ---------------------------------------------------
  const removeDiscount = async () => {
    form.setValue("payment.discountCode", "");

    form.setValue(
      "payment.total",
      form.getValues("payment.total") + (form_DiscountCodeAmount || 0)
    );

    setPrices((prevPrices) => {
      const newPrices = prevPrices?.map((price) => ({
        price: price.originalPrice,
        originalPrice: price.originalPrice,
      }));

      return newPrices;
    });

    setDiscountCode("");
    form.setValue("payment.discountCodeAmount", 0);
  };

  //!REMOVE PAYMENT ---------------------------------------------------
  const onDelete = async () => {
    const res = await deletePayment(payment?.id!);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.push("/enrollments/payments");
    }
  };

  return (
    <div className="card w-full col-span-12 lg:col-span-6 xl:col-span-3 h-min space-y-6">
      {/* //! Payment Status */}
      <FormField
        control={form.control}
        name="payment.status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
      <div className="space-y-3">
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
                        disabled={
                          !!discountCode || isUpdateType || !form_ItemsTotal
                        }
                        className={`${discountCode && !isUpdateType && "pl-9"}`}
                      />
                      {!!form_DiscountCodeAmount && !isUpdateType && (
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
                !!discountCode || !!!form.getValues("payment.discountCode")
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
                  disabled={isUpdateType || !form_ItemsTotal}
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
                <span className="text-gray-500">{selectedUser.fullName}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Phone</span>
                <span className="text-gray-500">{selectedUser.phone}</span>
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

          <li className="flex justify-between font-semibold">
            <span>Items Totals</span>
            <span>{formatPrice(form.watch("payment.itemsTotal"))}</span>
          </li>

          <li className="flex justify-between text-gray-500">
            <span className="font-medium">Discount Code</span>
            <span>{formatPrice(form_DiscountCodeAmount)}</span>
          </li>

          <li className="flex justify-between text-gray-500">
            <span className="font-medium">Manual Discount</span>
            <span>
              {formatPrice(form_DiscountAmount - form_DiscountCodeAmount)}
            </span>
          </li>

          <li
            className={`flex justify-between text-gray-500 ${form_DiscountAmount && "text-green-600"}`}
          >
            <span className={`font-medium `}>Total Discount</span>
            <span>{formatPrice(form.watch("payment.discountAmount"))}</span>
          </li>
          <Separator />
          <li>
            <Badge
              variant={
                isUpdateType && payment?.status === "SUCCESS" ? "green" : "blue"
              }
              className="flex justify-between py-3 text-sm"
            >
              <span className="font-semibold">
                {isUpdateType && payment?.status === "SUCCESS"
                  ? "Paid:"
                  : "Payable:"}
              </span>
              <span className="font-semibold">
                {formatPrice(form.watch("payment.total"), { showNumber: true })}
              </span>
            </Badge>
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <Button
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          className="w-full"
        >
          <Loader loading={form.formState.isSubmitting} />
          {isUpdateType ? "Update" : "Create"}
        </Button>
        {isUpdateType && (
          <DeleteButton
            onDelete={onDelete}
            disabled={form.formState.isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentFormSidebar;
