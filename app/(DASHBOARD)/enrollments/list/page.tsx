import Filter from "@/components/Filter";
import NewButton from "@/components/NewButton";
import Search from "@/components/Search";
import prisma from "@/prisma/client";
import EnrollmentsList from "./PaymentsList";
import { globalPageSize } from "@/data/pagination";

interface Props {
  searchParams: Promise<{ page: string; filer: string; search: string }>;
}

const totalPayments = 15;

const page = async ({ searchParams }: Props) => {
  // const { page, filer, search } = await searchParams;

  const enrollments = await prisma.enrollment.findMany({
    include: {
      user: true,
    },
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>Enrollments</h3>
        <div className="flex gap-3 justify-between items-center">
          <Search />

          <Filter
            placeholder="All Payments"
            options={[
              { label: "Pending", value: "PENDING" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Submitted", value: "COMPLETED" },
            ]}
          />

          <NewButton href="/enrollments/new" title="New Enrollment" />
        </div>
      </div>

      <EnrollmentsList
        payments={enrollments}
        totalPayments={totalPayments}
        pageSize={globalPageSize}
      />
    </div>
  );
};

export default page;
