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

import DeleteButton from "@/components/DeleteButton";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { getCouponByCode } from "@/data/coupon";
import useLoading from "@/hooks/useLoading";
import { formatPrice } from "@/lib/utils";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { CourseType, PaymentType } from "./PaymentForm";
import { deletePayment } from "@/actions/payment";
import { useRouter } from "next/navigation";

interface Props {
  form: UseFormReturn<EnrollmentFormType>;
  type: "NEW" | "UPDATE";
  prices: { price: number }[] | undefined;
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
  const form_DiscountCoupon = form.watch("payment.discountCode");
  const form_DiscountCodeAmount = form.watch("payment.discountCodeAmount");

  //! UPDATE COURSES PRICE
  useEffect(() => {
    const itemsTotal = prices?.reduce((acc, curr) => acc + curr.price, 0) || 0;
    form.setValue("payment.itemsTotal", itemsTotal);

    form.setValue("payment.total", itemsTotal - form_DiscountAmount);
  }, [selectedCourses, form]);

  //! UPDATE PRICE
  useEffect(() => {
    const totalDiscountAmount = form_ItemsTotal - form_Total;

    form.setValue(
      "payment.discountAmount",
      Math.min(form_ItemsTotal, totalDiscountAmount)
    );
  }, [form_Total, form_ItemsTotal]);

  //!APPLY DISCOUNT
  const applyDiscount = async () => {
    //COUPON
    const existingCoupon = await getCouponByCode(form_DiscountCoupon);
    if (!existingCoupon) {
      toast.error("Coupon Not Found...");
      return;
    }
    setDiscountCode(existingCoupon.code);
    form.setValue("payment.discountCodeAmount", existingCoupon.amount);

    // APPLY
    const totalDiscount = form_ItemsTotal - form_Total + existingCoupon.amount;
    form.setValue(
      "payment.total",
      Math.max(0, form_ItemsTotal - totalDiscount)
    );

    toast.success("Discount Applied");
  };

  //!REMOVE DISCOUNT
  const removeDiscount = async () => {
    const coupon = await getCouponByCode(form_DiscountCoupon);

    form.setValue("payment.discountCode", "");

    form.setValue(
      "payment.total",
      form.getValues("payment.total") + (coupon?.amount || 0)
    );

    setDiscountCode("");
    form.setValue("payment.discountCodeAmount", 0);
  };

  //!REMOVE PAYMENT
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
    <div className="card w-full col-span-3 h-min space-y-6">
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
              variant={isUpdateType ? "green" : "blue"}
              className="flex justify-between py-3 text-sm"
            >
              <span className="font-semibold">
                {isUpdateType ? "Paid:" : "Payable:"}
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
