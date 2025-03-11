import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ViewButton from "@/components/ViewButton";
import { EnrollmentType } from "./PaymentsList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Table from "@/components/Table";
import Image from "next/image";
import { placeHolder } from "@/public";

const PaymentPreview = ({ payment }: { payment: EnrollmentType }) => {
  const paymentPreview = [
    { label: "Payment Id", value: payment.id },
    {
      label: "User",
      value: payment.user.firstName + " " + payment.user.lastName,
    },
    { label: "Phone", value: payment.user.phone },
    { label: "Email", value: payment.user.email },
    { label: "Discount Code", value: payment.discount?.code || "-" },
    {
      label: "Discount Amount",
      value: payment.discount?.amount.toLocaleString("en-US") || 0,
    },
    { label: "Total", value: payment.total.toLocaleString("en-US") },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ViewButton />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preview Payment</DialogTitle>
          <div className="space-y-5">
            <ul>
              {paymentPreview.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between odd:bg-slate-50 p-3 text-sm  last:font-semibold"
                >
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>

            <ul>
              <DialogTitle>Course(s)</DialogTitle>
              {payment.courses.map((course, index) => (
                <li key={index} className="py-1 odd:bg-slate-50">
                  <Link
                    href={`/courses/${course.id}`}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Image
                      alt=""
                      src={course.image.url || placeHolder}
                      width={70}
                      height={70}
                      className="aspect-video object-cover rounded-sm
                      "
                    />

                    <p>{course.title}</p>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex justify-end">
              <Link href={`/payments/${payment.id}`}>
                <Button>Edit</Button>
              </Link>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPreview;
