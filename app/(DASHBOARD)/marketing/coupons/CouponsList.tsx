import EditButton from "@/components/EditButton";
import CouponForm from "@/components/forms/marketing/CouponForm";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/date";

export type Coupon = {
  id: number;
  coupon: string;
  type: "FIXED" | "PERCENT";
  amount: number;
  summery: string;
  used: number;
  limit: number;
  expiresAt?: Date;
};

interface Props {
  coupons: Coupon[];
  totalPayments: number;
}

const CouponsList = async ({ coupons, totalPayments }: Props) => {
  const pageSize = 15;

  return (
    <div className="card">
      <Table columns={columns} data={coupons} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalPayments} />
    </div>
  );
};

const renderRows = (coupon: Coupon) => {
  const fixed = coupon.type === "FIXED";

  return (
    <TableRow key={coupon.id} className="odd:bg-slate-50">
      <TableCell className="hidden xl:table-cell">{coupon.coupon}</TableCell>

      <TableCell className="text-left capitalize">
        {coupon.type.toLowerCase()}
      </TableCell>

      <TableCell className="text-center">
        {fixed ? coupon.amount.toLocaleString("en-US") : `%${coupon.amount}`}
      </TableCell>

      <TableCell className="text-center">{coupon.summery}</TableCell>

      <TableCell className="text-center hidden xl:table-cell">
        {coupon.limit > 0 ? (
          <span>
            {coupon.used} / {coupon.limit}
          </span>
        ) : (
          <span className="text-gray-400">No Limit</span>
        )}
      </TableCell>

      <TableCell
        className={`text-left hidden xl:table-cell font-medium text-primary ${
          coupon.expiresAt && coupon.expiresAt > new Date()
            ? "text-primary"
            : "text-red-400"
        }`}
      >
        {coupon.expiresAt ? (
          formatDate(coupon.expiresAt)
        ) : (
          <div className="text-gray-400">No Expiration</div>
        )}
      </TableCell>

      <TableCell className="lg:flex gap-2">
        <Dialog>
          <div className="flex justify-end w-full">
            <DialogTrigger asChild>
              <EditButton />
            </DialogTrigger>
          </div>
          <DialogContent>
            <DialogHeader className="space-y-6">
              <DialogTitle>Update Coupon</DialogTitle>
              <CouponForm type="UPDATE" coupon={coupon} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Coupon", className: "w-[300px] hidden xl:table-cell" },
  { label: "Type", className: "xl:w-[200px]" },
  {
    label: "Amount",
    className: "text-center  xl:w-[200px]",
  },
  { label: "Summery", className: "text-center" },
  {
    label: "Used / Limit",
    className: "text-center hidden xl:table-cell w-[250px]",
  },
  {
    label: "Expiration Date",
    className: "text-left w-[200px] hidden lg:table-cell",
  },
  {
    label: "Actions",
    className: "text-right w-[60px]",
  },
];

export default CouponsList;
