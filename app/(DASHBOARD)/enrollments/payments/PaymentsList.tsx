import EditButton from "@/components/EditButton";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/date";
import { formatPrice } from "@/lib/utils";
import {
  Course,
  Enrollment,
  Image as ImageType,
  Payment,
  User,
} from "@prisma/client";
import Link from "next/link";
import PaymentPreview from "./PaymentPreview";
import Avatar from "@/components/Avatar";

export interface PaymentType extends Payment {
  enrollment: (Enrollment & { course: Course & { image: ImageType | null } })[];
  user: User & { image: ImageType | null };
}

interface Props {
  payments: PaymentType[];
  totalPayments: number;
  pageSize: number;
}

const PaymentsList = async ({ payments, totalPayments, pageSize }: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={payments} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalPayments} />
    </div>
  );
};

const renderRows = (payment: PaymentType) => {
  const pending = payment.status === "PENDING";
  const canceled = payment.status === "CANCELED";
  const failed = payment.status === "FAILED";

  const statuses = pending ? (
    <Badge className="w-[85px]" variant={"orange"}>
      Pending
    </Badge>
  ) : canceled ? (
    <Badge className="w-[85px]" variant={"gray"}>
      Canceled
    </Badge>
  ) : failed ? (
    <Badge className="w-[85px]" variant={"red"}>
      Failed
    </Badge>
  ) : (
    <Badge className="w-[85px]" variant={"green"}>
      Success
    </Badge>
  );

  return (
    <TableRow key={payment.id} className="odd:bg-slate-50">
      <TableCell className="hidden xl:table-cell">{payment.id}</TableCell>

      <TableCell className="text-left">
        <Link
          href={`/payments/${payment.id}`}
          className="flex items-center gap-2"
        >
          <Avatar src={payment.user.image?.url} size={35} />{" "}
          {payment.user.fullName}
        </Link>
      </TableCell>

      <TableCell className="text-center">
        {formatDate(payment.paidAt)}
      </TableCell>

      <TableCell className="text-center">{statuses}</TableCell>

      <TableCell className="text-center text-gray-500">
        {payment.discountCode || "-"}
      </TableCell>

      <TableCell className="text-center text-gray-500">
        {payment.discountAmount ? formatPrice(payment.discountAmount) : "-"}
      </TableCell>

      <TableCell className="text-center text-gray-500">
        {formatPrice(payment.itemsTotal)}
      </TableCell>

      <TableCell className="hidden xl:table-cell font-semibold text-primary">
        {formatPrice(payment.total, { showNumber: true })}
      </TableCell>

      <TableCell className="lg:flex gap-2 hidden ">
        <div className="flex justify-end gap-2 w-full">
          <PaymentPreview payment={payment} />

          <EditButton href={`/enrollments/payments/${payment.id}`} />
        </div>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Id", className: "w-[90px] hidden xl:table-cell" },
  { label: "User", className: "xl:w-[150px]" },
  {
    label: "Paid At",
    className: "text-center  xl:w-[300px]",
  },
  { label: "Status", className: "text-center" },
  { label: "Discount Code", className: "text-center w-[200px]" },
  { label: "Discount Amount", className: "text-center w-[200px]" },
  { label: "Items Total", className: "text-center w-[200px]" },
  { label: "Total", className: "text-left hidden xl:table-cell w-[150px]" },
  {
    label: "Actions",
    className: "text-right w-[60px] hidden lg:table-cell",
  },
];

export default PaymentsList;
