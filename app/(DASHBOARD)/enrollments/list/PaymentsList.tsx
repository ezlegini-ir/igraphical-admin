import Avatar from "@/components/Avatar";
import EditButton from "@/components/EditButton";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Course, Enrollment, Image as ImageType, User } from "@prisma/client";
import Link from "next/link";
import PaymentPreview from "./EnrollmentPreview";
import { ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/date";

export interface EnrollmentType extends Enrollment {
  user: User & { image: ImageType | null };
  course: Course;
}

interface Props {
  payments: EnrollmentType[];
  totalPayments: number;
  pageSize: number;
}

const EnrollmentsList = async ({
  payments,
  totalPayments,
  pageSize,
}: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={payments} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalPayments} />
    </div>
  );
};

const renderRows = (enrollment: EnrollmentType) => {
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

  return (
    <TableRow key={enrollment.id} className="odd:bg-slate-50">
      <TableCell>
        <Link
          href={`/students?search=${enrollment.user.email}`}
          className="flex gap-2 items-center"
        >
          <Avatar src={enrollment.user.image?.url} size={40} />
          {enrollment.user.fullName}
        </Link>
      </TableCell>

      <TableCell className="text-left">
        <Link href={`/courses/${enrollment.course.id}`}>
          {enrollment.course.title}
        </Link>
      </TableCell>

      <TableCell className="text-center hidden lg:table-cell">
        {enrollment.paymentId ? (
          <Link
            href={`/courses/${enrollment.course.id}`}
            className="flex gap-1 items-start"
          >
            2423 <ExternalLink size={10} />
          </Link>
        ) : (
          <Badge variant={"green"}>Free</Badge>
        )}
      </TableCell>

      <TableCell className="text-center hidden lg:table-cell">
        {statuses}
      </TableCell>

      <TableCell className="text-center hidden lg:table-cell">
        {formatDate(enrollment.enrolledAt)}
      </TableCell>

      <TableCell className="flex gap-2">
        <div className="flex justify-end gap-2 w-full">
          <PaymentPreview enrollment={enrollment} />

          <EditButton href={`/payments/${enrollment.id}`} />
        </div>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "User", className: "w-[500px]" },
  { label: "Course", className: "text-left w-[400px]" },
  { label: "Payment", className: "text-center w-[400px] hidden lg:table-cell" },
  { label: "Status", className: "text-center w-[500px] hidden lg:table-cell" },
  {
    label: "Enrolled At",
    className: "text-center w-[500px] hidden lg:table-cell",
  },
  {
    label: "Actions",
    className: "text-right w-[60px]",
  },
];

export default EnrollmentsList;
