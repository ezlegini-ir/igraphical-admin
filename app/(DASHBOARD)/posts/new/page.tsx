import PostForm from "@/components/forms/dashboard/post/PostForm";
import { prisma } from "@igraphical/core";
import React from "react";

const page = async () => {
  const categories = await prisma.postCategory.findMany();
  const authors = await prisma.admin.findMany();

  return (
    <div className="space-y-3">
      <h3>Create New Post</h3>

      <PostForm type="NEW" authors={authors} categories={categories} />
    </div>
  );
};

export default page;
