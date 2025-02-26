import EditButton from "@/components/EditButton";
import CategoryForm from "@/components/forms/dashboard/post/CategoryForm";
import CommentForm from "@/components/forms/dashboard/post/CommentForm";
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
import { Star } from "lucide-react";
import Link from "next/link";

export type CommentType = {
  id: number;
  content: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: Date;
  post: {
    id: number;
    title: string;
  };
};

export interface Props {
  comments: CommentType[];
  totalComments: number;
}

const ReviewsList = ({ comments: reviews, totalComments }: Props) => {
  const pageSize = 10;

  return (
    <div className="card">
      <Table columns={columns} data={reviews} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalComments} />
    </div>
  );
};

const renderRows = (review: CommentType) => {
  return (
    <TableRow key={review.id} className="odd:bg-slate-50">
      <TableCell className="text-left">{review.content}</TableCell>

      <TableCell className="hidden md:table-cell">
        <Link href={`students/${review.user.id}`}>
          {review.user.firstName} {review.user.lastName}
        </Link>
      </TableCell>

      <TableCell className="hidden xl:table-cell">
        {review.createdAt.toLocaleString()}
      </TableCell>

      <TableCell className="hidden sm:table-cell">
        {review.post?.title}
      </TableCell>

      <TableCell>
        <Dialog>
          <div className="flex justify-end">
            <DialogTrigger asChild>
              <EditButton />
            </DialogTrigger>
          </div>
          <DialogContent>
            <DialogHeader className="space-y-6">
              <DialogTitle>Comment</DialogTitle>
              <CommentForm type="UPDATE" comment={review} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Comment", className: "sm:w-1/2" },
  { label: "User", className: "hidden md:table-cell" },
  { label: "Date", className: "hidden xl:table-cell" },
  { label: "Post", className: "hidden sm:table-cell" },
  {
    label: "Actions",
    className: "text-right w-[60px]",
  },
];

export default ReviewsList;
