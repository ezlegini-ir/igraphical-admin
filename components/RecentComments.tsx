import CardBox from "@/components/CardBox";
import Table from "@/components/Table";
import { TableCell, TableRow } from "@/components/ui/table";
import { Comment, Post, User } from "@prisma/client";
import Link from "next/link";

interface CommentType extends Comment {
  author: User | null;
  post: Post;
}

interface Props {
  comments: CommentType[];
}

const RecentComments = ({ comments }: Props) => {
  return (
    <CardBox
      btn={{ title: "View All", href: "/posts/comments" }}
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

const renderRows = (comment: CommentType) => {
  return (
    <TableRow className="text-xs text-gray-500 odd:bg-slate-50">
      <TableCell className="flex flex-col gap-1">
        {comment.content}
        <Link
          className="text-primary/60"
          href={`/students?search=${comment.author?.email}`}
        >
          {comment.author?.fullName || "GUEST"}
        </Link>
      </TableCell>
      <TableCell className="text-right">
        <Link
          dir="rtl"
          className="text-primary/60"
          href={`/posts/${comment.post.id}`}
        >
          {comment.post.title}
        </Link>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Comment", className: "text-left" },
  { label: "Post", className: "w-[200px] text-right" },
];

export default RecentComments;
