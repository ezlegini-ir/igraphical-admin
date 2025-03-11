import EditButton from "@/components/EditButton";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import PaymentPreview from "./PaymentPreview";
import { formatDate } from "@/lib/date";
import { Enrollment, User } from "@prisma/client";

interface EnrollmentType extends Enrollment {
  user: User;
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
    <Badge className="w-[85px]" variant={"orange"}>
      Pending
    </Badge>
  ) : in_progress ? (
    <Badge className="w-[85px]" variant={"red"}>
      In Progress
    </Badge>
  ) : (
    <Badge className="w-[85px]" variant={"green"}>
      Submitted
    </Badge>
  );

  return (
    <TableRow key={enrollment.id} className="odd:bg-slate-50">
      <TableCell className="hidden xl:table-cell">
        <Link
          href={`/payments/${enrollment.id}`}
          className="flex gap-2 items-center text-primary font-semibold "
        >
          {enrollment.id}
        </Link>
      </TableCell>

      <TableCell className="text-left">
        <Link
          href={`/payments/${enrollment.id}`}
          className="flex gap-2 items-center text-primary"
        >
          {enrollment.user.firstName} {enrollment.user.lastName}
        </Link>
      </TableCell>

      <TableCell className="text-center">
        {formatDate(enrollment.enrolledAt)}
      </TableCell>

      <TableCell className="text-center">{statuses}</TableCell>

      {/* <TableCell className="text-left hidden xl:table-cell font-medium text-primary">
        {enrollment.total.toLocaleString("en-US")}
      </TableCell> */}

      <TableCell className="lg:flex gap-2 hidden ">
        <div className="flex justify-end gap-2 w-full">
          <PaymentPreview payment={enrollment} />

          <EditButton href={`/payments/${enrollment.id}`} />
        </div>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Id", className: "w-[150px] hidden xl:table-cell" },
  { label: "User", className: "xl:w-[300px]" },
  {
    label: "Date",
    className: "text-center  xl:w-[300px]",
  },
  { label: "Status", className: "text-center" },
  { label: "Total (T)", className: "text-left hidden xl:table-cell w-[200px]" },
  {
    label: "Actions",
    className: "text-right w-[60px] hidden lg:table-cell",
  },
];

export default EnrollmentsList;
