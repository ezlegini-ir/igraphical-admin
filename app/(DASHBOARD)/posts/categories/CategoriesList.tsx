import EditButton from "@/components/EditButton";
import CategoryForm from "@/components/forms/dashboard/post/CategoryForm";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";

interface Props {
  categories: {
    id: number;
    name: string;
    url: string;
    post: { count: number };
  }[];
  totalCategories: number;
}

const CategoriesList = ({ categories, totalCategories }: Props) => {
  const pageSize = 15;
  return (
    <div className="card">
      <Table columns={columns} data={categories} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalCategories} />
    </div>
  );
};

const renderRows = (category: {
  id: number;
  name: string;
  url: string;
  post: { count: number };
}) => {
  return (
    <TableRow key={category.id} className="odd:bg-slate-50">
      <TableCell className="text-left">{category.name}</TableCell>

      <TableCell>{category.post?.count}</TableCell>
      <TableCell className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <EditButton />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="space-y-6">
              <DialogTitle>New Category</DialogTitle>
              <CategoryForm type="UPDATE" category={category} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Name", className: "" },
  { label: "Posts Count", className: "" },
  {
    label: "Actions",
    className: "text-right w-[60px]",
  },
];

export default CategoriesList;
