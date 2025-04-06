import PostForm from "@/components/forms/dashboard/post/PostForm";
import { getPostById } from "@/data/post";
import { prisma } from "@igraphical/core";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  const { id } = await params;

  const post = await getPostById(id);
  const categories = await prisma.postCategory.findMany();
  const authors = await prisma.admin.findMany();

  if (!post) notFound();

  return (
    <div className="space-y-3">
      <h3>Update Post</h3>

      <PostForm
        type="UPDATE"
        post={post}
        categories={categories}
        authors={authors}
      />
    </div>
  );
};

export default page;
