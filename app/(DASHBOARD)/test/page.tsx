"use client";

import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import React, { useState } from "react";
const TextEditor = dynamic(
  () => import("@/components/LexicalEditor/TextEditor"),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="w-full h-[450px] bg-white border rounded-sm" />
    ),
  }
);
const SimpleTextEditor = dynamic(
  () => import("@/components/LexicalEditor/SimpleTextEditor"),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="w-full h-[450px] bg-white border rounded-sm" />
    ),
  }
);

const page = () => {
  const [content, setContent] = useState("");
  return (
    <div className="space-y-3">
      <SimpleTextEditor onChange={setContent} value={content} />
      <TextEditor onChange={setContent} value={content} />
    </div>
  );
};

export default page;
