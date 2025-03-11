import EnrollmentStatusForm from "@/components/forms/enrollment/EnrollmentStatusForm";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ViewButton from "@/components/ViewButton";
import { formatDate } from "@/lib/date";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { EnrollmentType } from "./PaymentsList";

const PaymentPreview = ({ enrollment }: { enrollment: EnrollmentType }) => {
  const pending = enrollment.status === "PENDING";
  const in_progress = enrollment.status === "IN_PROGRESS";

  const statuses = pending ? (
    <Badge className="w-[100px]" variant={"orange"}>
      Pending
    </Badge>
  ) : in_progress ? (
    <Badge className="w-[100px]" variant={"blue"}>
      In Progress
    </Badge>
  ) : (
    <Badge className="w-[100px]" variant={"green"}>
      Completed
    </Badge>
  );

  const payment = enrollment.paymentId ? (
    <Link
      href={`/courses/${enrollment.course.id}`}
      className="flex gap-1 items-start"
    >
      2423 <ExternalLink size={10} />
    </Link>
  ) : (
    <Badge variant={"green"}>Free</Badge>
  );

  const paymentPreview = [
    { label: "Enrollment Id", value: enrollment.id },
    { label: "Course", value: enrollment.course.title },
    { label: "Status", value: statuses },
    { label: "Payment", value: payment },
    {
      label: "User",
      value: enrollment.user.fullName,
    },
    { label: "Phone", value: enrollment.user.phone },
    { label: "Email", value: enrollment.user.email },
    { label: "Enrolled At", value: formatDate(enrollment.enrolledAt) },
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
                  className="flex justify-between odd:bg-slate-50 p-3 text-sm"
                >
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>

            <EnrollmentStatusForm />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPreview;
