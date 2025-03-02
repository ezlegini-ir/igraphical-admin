import EditButton from "@/components/EditButton";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import PaymentPreview from "./PaymentPreview";
import { formatDate } from "@/lib/date";

type statuses = "PENDING" | "SUBMITTED" | "CANCELED";

export type Payment = {
  id: number;
  discount?: {
    amount: number;
    code: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  courses: {
    id: string;
    title: string;
    image: { url: string };
  }[];
  status: statuses;
  date: Date;
  total: number;
};

interface Props {
  payments: Payment[];
  totalPayments: number;
}

const PaymentsList = async ({ payments, totalPayments }: Props) => {
  const pageSize = 15;

  return (
    <div className="card">
      <Table columns={columns} data={payments} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalPayments} />
    </div>
  );
};

const renderRows = (payment: Payment) => {
  const pending = payment.status === "PENDING";
  const canceled = payment.status === "CANCELED";

  const statuses = pending ? (
    <Badge className="w-[85px]" variant={"orange"}>
      pending
    </Badge>
  ) : canceled ? (
    <Badge className="w-[85px]" variant={"red"}>
      canceled
    </Badge>
  ) : (
    <Badge className="w-[85px]" variant={"green"}>
      submitted
    </Badge>
  );

  return (
    <TableRow key={payment.id} className="odd:bg-slate-50">
      <TableCell className="hidden xl:table-cell">
        <Link
          href={`/payments/${payment.id}`}
          className="flex gap-2 items-center text-primary font-semibold "
        >
          {payment.id}
        </Link>
      </TableCell>

      <TableCell className="text-left">
        <Link
          href={`/payments/${payment.id}`}
          className="flex gap-2 items-center text-primary"
        >
          {payment.user.firstName} {payment.user.lastName}
        </Link>
      </TableCell>

      <TableCell className="text-center">{formatDate(payment.date)}</TableCell>

      <TableCell className="text-center">{statuses}</TableCell>

      <TableCell className="text-left hidden xl:table-cell font-medium text-primary">
        {payment.total.toLocaleString("en-US")}
      </TableCell>

      <TableCell className="lg:flex gap-2 hidden ">
        <div className="flex justify-end gap-2 w-full">
          <PaymentPreview payment={payment} />

          <EditButton href={`/payments/${payment.id}`} />
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

export default PaymentsList;
