"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  pageSize: number;
  totalItems: number;
}

const Pagination = ({ pageSize, totalItems }: Props) => {
  const pageCount = Math.ceil(totalItems / pageSize);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const changePage = (page: number) => {
    // Preserve existing query parameters
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", page.toString());

    // Update the URL with merged query parameters
    router.push(`?${params.toString()}`);
  };

  if (pageCount < 2) return null;

  return (
    <div className="space-x-3 text-sm flex items-center">
      <Button
        size={"icon"}
        variant={"ghost"}
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft />
      </Button>

      <p className="text-gray-500">
        Page {currentPage} / {pageCount}
      </p>

      <Button
        size={"icon"}
        variant={"ghost"}
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === pageCount}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default Pagination;
