import Filter from "@/components/Filter";
import NewButton from "@/components/NewButton";
import Search from "@/components/Search";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { pagination } from "@/data/pagination";
import prisma from "@/prisma/client";
import { SlidersHorizontal } from "lucide-react";
import CoursesList from "./CoursesList";

interface Props {
  searchParams: Promise<{ page: string; filer: string; search: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, filer, search } = await searchParams;

  const pageSize = 12;

  const { skip, take } = pagination(page, pageSize);

  const courses = await prisma.course.findMany({
    include: {
      image: true,
      tutor: true,
    },

    take,
    skip,
  });

  const totalCourses = await prisma.course.count();

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>Courses</h3>
        <div className="flex gap-3 justify-between items-center">
          <Search />

          <div className="hidden  gap-2  md:flex">
            <Filters />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="md:hidden" asChild>
                <Button size={"sm"} variant="outline">
                  <SlidersHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filters</DropdownMenuLabel>
                <div className="space-y-3">
                  <Filters />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <NewButton href="/courses/new" title="New Course" />
          </div>
        </div>
      </div>

      <CoursesList
        courses={courses}
        totalCourses={totalCourses}
        pageSize={pageSize}
      />
    </div>
  );
};

const Filters = () => {
  return (
    <>
      <Filter
        defaultValue="all"
        name="student"
        options={[
          { label: "All Students", value: "all" },
          { label: "Most Students", value: "most" },
          { label: "Lowest Students", value: "lowest" },
        ]}
      />
      <Filter
        defaultValue="all"
        name="status"
        options={[
          { label: "All Statuses", value: "all" },
          { label: "Published", value: "published" },
          { label: "Drafts", value: "drafts" },
        ]}
      />
      <Filter
        defaultValue="all"
        name="isFree"
        options={[
          { label: "All Prices", value: "all" },
          { label: "Free", value: "yes" },
          { label: "No Free", value: "no" },
        ]}
      />
      <Filter
        defaultValue="all"
        name="tutor"
        options={[
          { label: "All Tutors", value: "all" },
          { label: "Alireza Ezlegini", value: "alireza-ezlegini" },
          { label: "Fateme Ahmadi", value: "fateme-ahmadi" },
        ]}
      />
      <Filter
        defaultValue="all"
        name="rate"
        options={[
          { label: "All Rates", value: "all" },
          { label: "Highest", value: "high" },
          { label: "Lowest", value: "low" },
        ]}
      />
    </>
  );
};

export default page;
