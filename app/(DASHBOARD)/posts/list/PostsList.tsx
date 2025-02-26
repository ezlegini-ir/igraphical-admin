import NewButton from "@/components/NewButton";
import Pagination from "@/components/Pagination";
import Filter from "@/components/Filter";
import Table from "@/components/Table";
import { TableCell, TableRow } from "@/components/ui/table";
import { placeHolder } from "@/public";
import Image from "next/image";
import Link from "next/link";
import Search from "@/components/Search";
import EditButton from "@/components/EditButton";
import ViewButton from "@/components/ViewButton";

interface Props {
  posts: {
    id: number;
    title: string;
    image: {
      url: string;
    };
    author: {
      name: string;
    };
    category: {
      name: string;
    }[];
    views: number;
    publishedAt: Date;
  }[];
  totalPosts: number;
}

const PostsList = async ({ posts, totalPosts }: Props) => {
  const pageSize = 15;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>Posts</h3>
        <div className="flex gap-3 justify-between items-center">
          <Search />

          <Filter
            defaultValue="all"
            placeholder="All Posts"
            options={[
              { label: "All Posts", value: "all" },
              { label: "Published", value: "published" },
              { label: "Drafts", value: "drafts" },
              { label: "My Posts", value: "my-posts" },
            ]}
          />

          <NewButton href="/posts/new" />
        </div>
      </div>

      <div className="card">
        <Table columns={columns} data={posts} renderRows={renderRows} />
        <Pagination pageSize={pageSize} totalItems={totalPosts} />
      </div>
    </div>
  );
};

const renderRows = (post: {
  id: number;
  href: string;
  title: string;
  image: { url: string };
  author: { name: string };
  category: { name: string }[];
  views: number;
  publishedAt: Date;
}) => {
  return (
    <TableRow key={post.href} className="odd:bg-slate-50">
      <TableCell>
        <Link
          href={`/posts/${post.id}`}
          className="flex gap-2 items-center text-primary"
        >
          <Image
            alt=""
            src={post.image?.url || placeHolder}
            width={65}
            height={65}
            className="rounded-sm object-cover hidden lg:block"
          />
          {post.title}
        </Link>
      </TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {post.author.name}
      </TableCell>
      <TableCell className="text-center">
        {post.category.map((item, index) => (
          <span key={index}>{item.name}</span>
        ))}
      </TableCell>
      <TableCell className="text-center">
        {post.views.toLocaleString("en-US")}
      </TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {post.publishedAt.toLocaleDateString()}
      </TableCell>
      <TableCell className="lg:flex gap-2 hidden ">
        <EditButton href={`/posts/${post.id}`} />
        <ViewButton href={""} />
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Title", className: "w-[550px]" },
  { label: "Author", className: "text-center hidden xl:table-cell" },
  { label: "Category", className: "text-center" },
  { label: "Views", className: "text-center" },
  { label: "Published At", className: "text-center hidden xl:table-cell" },
  {
    label: "Actions",
    className: "text-right w-[60px] hidden lg:table-cell",
  },
];

export default PostsList;
