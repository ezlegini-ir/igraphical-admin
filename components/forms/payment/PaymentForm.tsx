"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import useError from "@/hooks/useError";
import useLoading from "@/hooks/useLoading";
import useSuccess from "@/hooks/useSuccess";
import { cn } from "@/lib/utils";
import {
  PaymentsFormType,
  paymentMethod,
  paymentStatus,
  paymentsFormSchema,
} from "@/lib/validationSchema";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export type Payment = PaymentsFormType & { transactionId: string; id: number };

interface Props {
  type: "NEW" | "UPDATE";
  payment?: Payment;
}

const PaymentForm = ({ type, payment }: Props) => {
  // HOOKS
  const router = useRouter();
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();
  const { success, setSuccess } = useSuccess();
  const [newCourseId, setNewCourseId] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const isUpdateType = type === "UPDATE";

  const itemsTotal = 1_273_000;

  const form = useForm<PaymentsFormType>({
    resolver: zodResolver(paymentsFormSchema),
    mode: "onSubmit",
    defaultValues: {
      createdAt: payment?.createdAt || new Date(),
      paymentMethod: payment?.paymentMethod || "admin",
      status: payment?.status || "SUBMITTED",
      total: payment?.total || 0,
      user: payment?.user || "",
      courses: payment?.courses || [{ id: "" }],
      discountCode: payment?.discountCode || "",
    },
  });

  const onSubmit = async (data: PaymentsFormType) => {
    setError("");
    setLoading(true);
    console.log("Submitted data:", data);
    form.reset();
    router.refresh();
    setSuccess("Created Successfully");
    setLoading(false);
  };

  const onDelete = (id: number | string) => {
    console.log("Delete" + id);
  };

  // Use Field Array for courses
  const {
    fields: coursesFields,
    append: coursesAppend,
    remove: coursesRemove,
  } = useFieldArray({
    name: "courses",
    control: form.control,
  });

  const applyDiscount = () => {
    const discountCode =
      payment?.discountCode || form.getValues("discountCode");

    if (!discountCode) {
      setError("Invalid Discount Code");
      return;
    }

    //TODO: Fetch Code from DB

    const discountAmount = 100_000;

    setDiscountAmount(discountAmount);
    form.setValue("total", form.getValues("total") - discountAmount);
  };

  const removeDiscount = () => {
    form.setValue("discountCode", "");
    form.setValue("total", form.getValues("total") + discountAmount);
    setDiscountAmount(0);
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-12 gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="col-span-12 md:col-span-6 xl:col-span-9 space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-4 gap-3 card">
            {/* //! Created At */}
            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end gap-1 ">
                  <FormLabel>Created At</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 h-9  text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
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

            {/* Payment Status */}
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
                              status === "SUBMITTED"
                                ? "text-green-600"
                                : status === "PENDING"
                                ? "text-yellow-500"
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

            {/* Payment Method */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethod.map((method, index) => (
                        <SelectItem key={index} value={method}>
                          <span className="capitalize">
                            {method.toLocaleLowerCase()}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* User */}
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user for payment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"1"}>Alrieza Ezlegini</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Courses Dynamic Section */}
          <div className="space-y-2 card">
            <h3 className="text-lg font-medium">Courses</h3>
            {coursesFields.map((courseField, index) => (
              <div key={courseField.id} className="flex items-end gap-2">
                <FormField
                  control={form.control}
                  name={`courses.${index}.id`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Course {index + 1}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Course ID ${index + 1}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => coursesRemove(index)}
                >
                  Remove
                </Button>
              </div>
            ))}

            {/* Add Course using ShadCN Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="secondary" className="mt-2">
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Add a Course</DialogTitle>
                <DialogDescription>
                  Enter the Course ID below and click "Add Course" to append it.
                </DialogDescription>
                <Input
                  placeholder="Course ID"
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                />
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => {
                      coursesAppend({ id: newCourseId });
                      setNewCourseId("");
                    }}
                  >
                    Add Course
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-3 col-span-12 md:col-span-6 xl:col-span-3 card">
          <div className="flex items-end gap-2">
            {/* Discount Code */}
            <FormField
              control={form.control}
              name="discountCode"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Discount Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="button" onClick={applyDiscount} variant={"outline"}>
              Apply
            </Button>
          </div>

          {discountAmount !== 0 && (
            <Button
              type="button"
              onClick={removeDiscount}
              variant={"secondary"}
            >
              <X /> {form.getValues("discountCode")}
            </Button>
          )}

          {/* Total */}
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
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <ul className="space-y-4 py-5 text-sm">
            <li className="flex justify-between">
              <span className="font-medium">User</span>
              <span>علیرضا ازلگینی</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Phone</span>
              <span>09127452859</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Email</span>
              <span>ezlegini.ir@gmail.com</span>
            </li>
            <Separator />
            <li className="flex justify-between">
              <span className="font-medium">Items Totals</span>
              <span>{itemsTotal.toLocaleString("en-US")}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Discount</span>
              <span>-{discountAmount.toLocaleString("en-US")}</span>
            </li>
            <Separator />
            <li className="flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">
                {form.getValues("total").toLocaleString("en-US")}
              </span>
            </li>
          </ul>

          <Button
            disabled={
              !form.formState.isValid || !form.formState.isDirty || loading
            }
            className="w-full flex gap-2"
            type="submit"
          >
            {loading ? (
              <Loader loading={loading} />
            ) : isUpdateType ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
          {isUpdateType && (
            <DeleteButton id={payment?.id!} onDelete={onDelete} />
          )}

          <Error error={error} />
          <Success success={success} />
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;
