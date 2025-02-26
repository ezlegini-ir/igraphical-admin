import PostForm from "@/components/forms/dashboard/PostForm";
import { coursePic } from "@/public";
import React from "react";

const page = () => {
  return (
    <div className="space-y-3">
      <h3>Update Post</h3>

      <PostForm type="UPDATE" post={post} />
    </div>
  );
};

export default page;

const post:
  | {
      title: string;
      url: string;
      content: string;
      categories: {
        id: number;
      }[];
      image: {
        url: string;
      };
      author: {
        id: number;
      };
      status: "0" | "1";
    }
  | undefined = {
  title: "چطور در ادوبی ایلوستریتور سوااچ هارا برگردانیم؟",
  author: { id: 123 },
  content: "محتوا",
  categories: [{ id: 3 }, { id: 2 }],
  image: { url: coursePic },
  status: "1",
  url: "چطور-در-ادوبی-ایلوستریور",
};
