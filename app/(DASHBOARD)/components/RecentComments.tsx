import CardBox from "@/components/CardBox";
import Table from "@/components/Table";
import { TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";

interface Props {
  comments: {
    comment: string;
    author: string;
    post: { title: string; href: string };
  }[];
}

const RecentComments = ({ comments }: Props) => {
  return (
    <CardBox
      btn={{ title: "View All", href: "#" }}
      title="Recent Comments"
      className="col-span-6"
    >
      <Table
        columns={columns}
        data={comments}
        renderRows={renderRows}
        noDataMessage="No Data Available"
      />
    </CardBox>
  );
};

const renderRows = (data: {
  comment: string;
  author: string;
  post: { href: string; title: string };
}) => {
  return (
    <TableRow className="text-xs text-gray-500">
      <TableCell className="flex flex-col gap-1">
        {data.comment}
        <Link className="text-primary/60" href={data.author}>
          {data.author}
        </Link>
      </TableCell>
      <TableCell className="text-right">
        <Link dir="rtl" className="text-primary/60" href={data.post.href}>
          {data.post.title}
        </Link>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Comment", className: "text-left" },
  { label: "Post", className: "w-[200px]" },
];

export default RecentComments;
