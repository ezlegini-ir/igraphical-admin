import EditButton from "@/components/EditButton";
import StudentForm from "@/components/forms/user/StudentForm";
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
import { User } from "@prisma/client";
import { formatDistance } from "date-fns";

interface Props {
  students: User[];
  totalStudents: number;
  pageSize: number;
}

const StudentsList = async ({ students, totalStudents, pageSize }: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={students} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalStudents} />
    </div>
  );
};

const renderRows = (student: User) => {
  return (
    <TableRow key={student.id} className="odd:bg-slate-50">
      <TableCell>
        {student.firstName} {student.lastName}
      </TableCell>
      <TableCell className="text-center">{student.email}</TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {student.phone}
      </TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {formatDistance(student.joinedAt, new Date(), { addSuffix: true })}
      </TableCell>

      <TableCell className="lg:flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <EditButton />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="space-y-6">
              <DialogTitle>Update Student</DialogTitle>
              <StudentForm type="UPDATE" student={student} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Name", className: "" },
  { label: "Email", className: "text-center" },
  { label: "Phone", className: "text-center  hidden xl:table-cell" },
  { label: "User Since", className: "text-center hidden xl:table-cell" },
  {
    label: "Actions",
    className: "text-right w-[60px]",
  },
];

export default StudentsList;
