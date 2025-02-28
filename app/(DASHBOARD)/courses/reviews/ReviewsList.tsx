import EditButton from "@/components/EditButton";
import ReviewForm from "@/components/forms/dashboard/course/ReviewForm";
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
import { Star } from "lucide-react";
import Link from "next/link";

export type ReviewType = {
  id: number;
  content: string;
  rate: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  course: {
    id: number;
    title: string;
  };
};

export interface Props {
  reviews: ReviewType[];
  totalReviews: number;
}

const ReviewsList = ({ reviews, totalReviews }: Props) => {
  const pageSize = 10;

  return (
    <div className="card">
      <Table columns={columns} data={reviews} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalReviews} />
    </div>
  );
};

const renderRows = (review: ReviewType) => {
  return (
    <TableRow key={review.id} className="odd:bg-slate-50">
      <TableCell className="text-left">{review.content}</TableCell>

      <TableCell className="hidden md:table-cell">
        <Link href={`students/${review.user.id}`}>
          {review.user.firstName} {review.user.lastName}
        </Link>
      </TableCell>

      <TableCell>
        <div className="flex gap-1 font-medium">
          {Array.from({ length: review.rate }).map((_, index) => (
            <Star
              kernelMatrix={index}
              fill="#facc15"
              className="text-yellow-400"
              size={15}
            />
          ))}
        </div>
      </TableCell>

      <TableCell className="hidden xl:table-cell">
        {review.createdAt.toLocaleString()}
      </TableCell>

      <TableCell className="hidden sm:table-cell">
        {review.course?.title}
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
              <ReviewForm type="UPDATE" review={review} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Review", className: "sm:w-1/2" },
  { label: "Student", className: "hidden md:table-cell" },
  { label: "Rate", className: "hidden md:table-cell" },
  { label: "Date", className: "hidden xl:table-cell" },
  { label: "Course", className: "hidden sm:table-cell" },
  {
    label: "Actions",
    className: "text-right w-[60px]",
  },
];

export default ReviewsList;
