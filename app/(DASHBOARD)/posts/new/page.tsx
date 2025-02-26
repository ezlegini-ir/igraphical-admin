import PostForm from "@/components/forms/dashboard/PostForm";
import React from "react";

const page = () => {
  return (
    <div className="space-y-3">
      <h3>Create New Post</h3>

      <PostForm type="NEW" />
    </div>
  );
};

export default page;
