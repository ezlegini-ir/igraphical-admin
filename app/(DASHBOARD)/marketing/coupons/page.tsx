import Filter from "@/components/Filter";
import CouponForm from "@/components/forms/coupon/CouponForm";
import Search from "@/components/Search";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CouponsList, { Coupon } from "./CouponsList";
interface Props {
  searchParams: Promise<{ page: string; filer: string; search: string }>;
}

const totalPayments = 15;

const page = async ({ searchParams }: Props) => {
  // const { page, filer, search } = await searchParams;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>Coupons</h3>
        <div className="flex gap-3 justify-between items-center">
          <Search />

          <Filter
            defaultValue="all"
            placeholder="Expiration"
            name="expired"
            options={[
              { label: "All Coupons", value: "all" },
              { label: "Expired", value: "true" },
              { label: "Not Expired", value: "false" },
            ]}
          />

          <Dialog>
            <DialogTrigger asChild>
              <Button size={"sm"} className="px-6 lg:px-10">
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="space-y-6">
                <DialogTitle>New Coupon</DialogTitle>
                <CouponForm type="NEW" />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CouponsList coupons={coupons} totalPayments={totalPayments} />
    </div>
  );
};

const coupons: Coupon[] = [
  {
    amount: 50,
    coupon: "IGRAPHC",
    expiresAt: new Date("2025-02-05"),
    id: 12,
    limit: 0,
    used: 10,
    summery: "کد تخفیف ویژه جشنواره تابستانی آیگرافیکال",
    type: "PERCENT",
  },
  {
    amount: 200000,
    coupon: "IGRAPHC",
    expiresAt: new Date("2025-03-03"),
    id: 14,
    limit: 20,
    used: 10,
    summery: "کد تخفیف ویژه جشنواره تابستانی آیگرافیکال",
    type: "FIXED",
  },
  {
    amount: 50,
    coupon: "IGRAPHC",
    id: 144,
    limit: 20,
    used: 10,
    summery: "کد تخفیف ویژه جشنواره تابستانی آیگرافیکال",
    type: "PERCENT",
  },
];

export default page;
