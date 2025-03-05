import { FileWarning } from "lucide-react";
import { Metadata } from "next";
import React from "react";

const notFound = () => {
  return (
    <div className="flex justify-center items-center gap-3 h-screen bg-black text-white">
      <FileWarning />
      Could not Found This Page
    </div>
  );
};

export default notFound;

export const metadata: Metadata = {
  title: "404: Not Found",
};
