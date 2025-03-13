import Filter from "@/components/Filter";
import NewButton from "@/components/NewButton";
import Search from "@/components/Search";
import prisma from "@/prisma/client";
import EnrollmentsList from "./EnrollmentsList";
import { globalPageSize, pagination } from "@/data/pagination";
import { EnrollmentStatus, Prisma } from "@prisma/client";

interface Props {
  searchParams: Promise<{
    page: string;
    status: string;
    search: string;
    isFree: string;
  }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, status, search, isFree } = await searchParams;

  const where: Prisma.EnrollmentWhereInput = {
    AND: [
      search
        ? {
            user: {
              OR: [
                { fullName: { contains: search } },
                { email: { contains: search } },
                { nationalId: { contains: search } },
                { phone: { contains: search } },
              ],
            },
          }
        : {},
      status ? { status: status as EnrollmentStatus } : {},
      isFree ? (isFree === "yes" ? { price: 0 } : { price: { not: 0 } }) : {},
    ].filter(Boolean), // Remove undefined values
  };

  const { skip, take } = pagination(page);
  const enrollments = await prisma.enrollment.findMany({
    where,
    include: {
      payment: true,
      user: {
        include: { image: true },
      },
      course: true,
    },
    orderBy: { id: "desc" },

    skip,
    take,
  });
  const totalEnrollments = await prisma.enrollment.count({ where });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>{totalEnrollments} Enrollments</h3>
        <div className="flex gap-3 flex-wrap justify-between items-center">
          <Search placeholder="Search Users..." />

          <Filter
            placeholder="All Statuses"
            name="status"
            options={[
              { label: "Pending", value: "PENDING" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Completed", value: "COMPLETED" },
            ]}
          />

          <Filter
            placeholder="All Prices"
            name="isFree"
            options={[
              { label: "Free", value: "yes" },
              { label: "No Free", value: "no" },
            ]}
          />

          <NewButton href="/enrollments/new" title="New Enrollment" />
        </div>
      </div>

      <EnrollmentsList
        payments={enrollments}
        totalPayments={totalEnrollments}
        pageSize={globalPageSize}
      />
    </div>
  );
};

export default page;
