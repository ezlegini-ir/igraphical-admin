import CommentForm from "@/components/forms/dashboard/post/CommentForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { globalPageSize, pagination } from "@/data/pagination";
import prisma from "@/prisma/client";
import CommentsList from "./CommentsList";

interface Props {
  searchParams: Promise<{ page: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { page } = await searchParams;
  const { skip, take } = pagination(page);

  const comments = await prisma.comment.findMany({
    skip,
    take,
    include: {
      author: true,
      post: true,
    },
    orderBy: {
      id: "desc",
    },
  });
  const totalComments = await prisma.comment.count();

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3>{totalComments} Comments</h3>
        <div className="flex gap-3 justify-between items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button size={"sm"} className="px-6 lg:px-10">
                New Comment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="space-y-6">
                <DialogTitle>New Comment</DialogTitle>
                <CommentForm type="NEW" />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CommentsList
        comments={comments}
        totalComments={totalComments}
        pageSize={globalPageSize}
      />
    </div>
  );
};

export default page;
