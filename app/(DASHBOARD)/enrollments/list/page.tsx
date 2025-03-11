import Filter from "@/components/Filter";
import NewButton from "@/components/NewButton";
import Search from "@/components/Search";
import prisma from "@/prisma/client";
import EnrollmentsList from "./PaymentsList";
import { globalPageSize, pagination } from "@/data/pagination";
import { EnrollmentStatus, Prisma } from "@prisma/client";

interface Props {
  searchParams: Promise<{
    page: string;
    status: string;
    search: string;
  }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, status, search } = await searchParams;

  const where: Prisma.EnrollmentWhereInput = {
    status: status ? (status as EnrollmentStatus) : undefined,

    user: search
      ? {
          OR: [
            { fullName: { contains: search } },
            { email: { contains: search } },
            { nationalId: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : undefined,
  };

  const { skip, take } = pagination(page);
  const enrollments = await prisma.enrollment.findMany({
    where,
    include: {
      user: {
        include: { image: true },
      },
      course: true,
    },

    skip,
    take,
  });
  const totalEnrollments = await prisma.enrollment.count({ where });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>Enrollments</h3>
        <div className="flex gap-3 justify-between items-center">
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
