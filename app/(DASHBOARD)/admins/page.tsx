import Filter from "@/components/Filter";
import AdminForm from "@/components/forms/dashboard/admin/AdminForm";
import NewButton from "@/components/NewButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import prisma from "@/prisma/client";
import { AdminRole } from "@prisma/client";
import AdminsList from "./AdminsList";
interface Props {
  searchParams: Promise<{ page: string; filter: string; search: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, filter } = await searchParams;

  const pageSize = 15;

  const admins = await prisma.admin.findMany({
    where: {
      role: filter === "all" ? undefined : (filter as AdminRole),
    },
    skip: ((+page || 1) - 1) * pageSize,
    take: pageSize,
  });
  const totalAdmins = await prisma.admin.count();

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>Posts</h3>
        <div className="flex gap-3 justify-between items-center">
          <Filter
            defaultValue="all"
            placeholder="All Admins"
            options={[
              { label: "All Admins", value: "all" },
              { label: "Adminstrators", value: "ADMIN" },
              { label: "Authors", value: "AUTHOR" },
            ]}
          />

          <Dialog>
            <DialogTrigger asChild>
              <NewButton />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="space-y-6">
                <DialogTitle>New Admin</DialogTitle>
                <AdminForm type="NEW" />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <AdminsList
        admins={admins}
        totalAdmins={totalAdmins}
        pageSize={pageSize}
      />
    </div>
  );
};

export default page;
