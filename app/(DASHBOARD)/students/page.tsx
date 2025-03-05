import StudentForm from "@/components/forms/user/StudentForm";
import NewButton from "@/components/NewButton";
import Search from "@/components/Search";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import prisma from "@/prisma/client";
import StudentsList from "./StudentsList";
interface Props {
  searchParams: Promise<{ page: string; search: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, search } = await searchParams;
  const pageSize = 15;

  // Build the search filter only if a search term is provided
  const where = search
    ? {
        OR: [
          { email: { contains: search } },
          { phone: { contains: search } },
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { fullName: { contains: search } },
          { nationalId: { contains: search } },
        ],
      }
    : {};

  // Use the filter in findMany and count
  const users = await prisma.user.findMany({
    where,
    orderBy: { id: "desc" },
    include: { image: true },

    skip: ((+page || 1) - 1) * pageSize,
    take: pageSize,
  });
  const totalStudents = await prisma.user.count({ where });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>Students</h3>
        <div className="flex gap-3 justify-between items-center">
          <Search />

          <Dialog>
            <DialogTrigger asChild>
              <NewButton title="New Student" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="space-y-6">
                <DialogTitle>New Student</DialogTitle>
                <StudentForm type="NEW" />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <StudentsList
        students={users}
        totalStudents={totalStudents}
        pageSize={pageSize}
      />
    </div>
  );
};

export default page;
