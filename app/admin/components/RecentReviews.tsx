import CardBox from "@/components/CardBox";
import Table from "@/components/Table";
import { TableCell, TableRow } from "@/components/ui/table";
import { Star } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  reviews: {
    review: string;
    rate: number;
    course: { title: string; href: string };
    student: { name: string; href: string };
  }[];
}

const RecentReviews = ({ reviews }: Props) => {
  return (
    <CardBox
      btn={{ title: "View All", href: "#" }}
      title="Recent Comments"
      className="col-span-6"
    >
      <Table
        columns={columns}
        data={reviews}
        renderRows={renderRows}
        noDataMessage="No Data Available"
      />
    </CardBox>
  );
};

const renderRows = (data: {
  review: string;
  rate: number;
  course: { href: string; title: string };
  student: { name: string; href: string };
}) => {
  return (
    <TableRow className="text-xs text-gray-500">
      <TableCell className="flex flex-col gap-1">
        {data.review}
        <span className="flex items-center gap-1">
          <Link dir="rtl" className="text-primary/60" href={data.course.href}>
            {data.course.title}
          </Link>
          <div className="flex">
            {Array.from({ length: data.rate }).map((_, index) => (
              <Star
                key={index}
                fill="#eab308"
                className="text-yellow-500"
                size={12}
              />
            ))}
          </div>
        </span>
      </TableCell>
      <TableCell className="text-right">
        <Link href={data.student.href}>{data.student.name}</Link>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Review", className: "text-left" },
  { label: "Student", className: "w-[150px]" },
];

export default RecentReviews;
