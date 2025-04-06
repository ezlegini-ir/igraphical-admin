import Filter from "@/components/Filter";
import CouponForm from "@/components/forms/marketing/CouponForm";
import Search from "@/components/Search";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { pagination } from "@/data/pagination";
import { prisma } from "@igraphical/core";
import CouponsList from "./CouponsList";
import { Prisma } from "@prisma/client";
interface Props {
  searchParams: Promise<{
    page: string;
    expired: string;
    search: string;
    type: string;
    usage: string;
  }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, expired, search, type, usage } = await searchParams;

  const where: Prisma.CouponWhereInput = {
    to: expired
      ? expired === "true"
        ? { lt: new Date() }
        : { gte: new Date() }
      : undefined,
    type: type ? (type === "fixed" ? "FIXED" : "PERCENT") : undefined,
    code: search ? { contains: search } : undefined,
  };
  const orderBy: Prisma.CouponOrderByWithRelationInput[] = [];
  if (usage) {
    orderBy.push({ used: usage === "most" ? "desc" : "asc" });
  } else {
    orderBy.push({ id: "desc" });
  }

  const { skip, take } = pagination(page);

  const coupons = await prisma.coupon.findMany({
    where,
    include: {
      courseExclude: true,
      courseInclude: true,
    },
    orderBy,

    skip,
    take,
  });

  const totalCoupons = await prisma.coupon.count({ where });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>{totalCoupons} Coupons</h3>
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <Search placeholder="Search Codes..." />

          <Filter
            placeholder="All Dates"
            name="expired"
            options={[
              { label: "Expired", value: "true" },
              { label: "Not Expired", value: "false" },
            ]}
          />

          <Filter
            placeholder="All Types"
            name="type"
            options={[
              { label: "Fixed", value: "fixed" },
              { label: "Percent", value: "percent" },
            ]}
          />

          <Filter
            placeholder="All Usage"
            name="usage"
            options={[
              { label: "Most Used", value: "most" },
              { label: "Lowest Used", value: "lowest" },
            ]}
          />

          <Dialog>
            <DialogTrigger asChild>
              <Button size={"sm"} className="px-6 lg:px-10">
                New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-screen-lg">
              <DialogHeader className="space-y-6">
                <DialogTitle>New Coupon</DialogTitle>
                <CouponForm type="NEW" />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CouponsList coupons={coupons} totalPayments={totalCoupons} />
    </div>
  );
};

export default page;
