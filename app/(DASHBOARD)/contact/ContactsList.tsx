import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import ViewButton from "@/components/ViewButton";
import ContactForm, {
  ContactType,
} from "@/components/forms/contact/ContactForm";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/date";

interface Props {
  contacts: ContactType[];
  totalContacts: number;
  pageSize: number;
}

const PostsList = async ({ contacts, totalContacts, pageSize }: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={contacts} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalContacts} />
    </div>
  );
};

const renderRows = (contact: ContactType) => {
  return (
    <TableRow key={contact.id} className="odd:bg-slate-50">
      <TableCell>{contact.fullName}</TableCell>
      <TableCell className="hidden lg:table-cell">{contact.email}</TableCell>
      <TableCell className="hidden xl:table-cell">{contact.phone}</TableCell>
      <TableCell className="text-center" dir="rtl">
        {contact.subject}
      </TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {formatDate(contact.createdAt)}
      </TableCell>
      <TableCell className="text-center">
        <Badge variant={contact.status === "PENDING" ? "orange" : "green"}>
          {contact.status}
        </Badge>
      </TableCell>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <ViewButton />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Message</DialogTitle>
              <ContactForm contact={contact} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Full Name", className: "hidden xl:table-cell" },
  { label: "Email", className: "hidden lg:table-cell" },
  { label: "Phone", className: "" },
  { label: "Subject", className: "text-center" },
  { label: "Created At", className: "text-center hidden xl:table-cell" },
  { label: "Status", className: "text-center" },
  {
    label: "View",
    className: "text-right w-[60px]",
  },
];

export default PostsList;
