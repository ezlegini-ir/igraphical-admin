import EditButton from "@/components/EditButton";
import AdminForm from "@/components/forms/dashboard/admin/AdminForm";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { AdminRole } from "@prisma/client";

export type AdminListType = {
  id: string;
  name: string;
  displayName: string;
  phone: string;
  email: string;
  role: AdminRole;
};

interface Props {
  admins: AdminListType[];
  totalAdmins: number;
  pageSize: number;
}

const AdminsList = async ({ admins, totalAdmins, pageSize }: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={admins} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalAdmins} />
    </div>
  );
};

const renderRows = (admin: AdminListType & { password: string }) => {
  return (
    <TableRow key={admin.id} className="odd:bg-slate-50">
      <TableCell>{admin.name}</TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {admin.displayName}
      </TableCell>
      <TableCell className="text-center text-xs font-medium text-gray-500">
        {admin.role === "ADMIN" ? (
          <Badge variant={"blue"}>{admin.role}</Badge>
        ) : (
          admin.role
        )}
      </TableCell>
      <TableCell className="text-center">{admin.email}</TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {admin.phone}
      </TableCell>
      <TableCell className="lg:flex gap-2 hidden ">
        <Dialog>
          <DialogTrigger asChild>
            <EditButton />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="space-y-6">
              <DialogTitle>Update Admin</DialogTitle>
              <AdminForm type="UPDATE" admin={admin} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Name", className: "" },
  { label: "Display Name", className: "text-center hidden xl:table-cell" },
  { label: "Role", className: "text-center" },
  { label: "Email", className: "text-center" },
  { label: "Phone", className: "text-center hidden xl:table-cell" },
  {
    label: "Actions",
    className: "text-right w-[60px] hidden lg:table-cell",
  },
];

export default AdminsList;
