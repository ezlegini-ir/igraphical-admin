"use client";

import { useEffect, useState } from "react";
import SearchField from "./forms/SearchField";
import { Course } from "@prisma/client";
import { searchCourses } from "@/data/search";
import { getCourseById } from "@/data/course";

const SearchCourses = ({
  field,
  courseId,
  placeHolder,
}: {
  field: any;
  courseId?: number;
  placeHolder?: string;
}) => {
  const [defaultCourse, setDefaultCourse] = useState<Course | undefined>(
    undefined
  );

  const fetchCourses = async (query: string): Promise<Course[]> => {
    return await searchCourses(query);
  };

  useEffect(() => {
    const fetchSelectedCourse = async () => {
      if (courseId) {
        const course = await getCourseById(courseId);
        setDefaultCourse(course ? course : undefined);
      }
    };
    fetchSelectedCourse();
  }, [courseId]);

  return (
    <SearchField<Course>
      placeholder={placeHolder}
      fetchResults={fetchCourses}
      onSelect={(course) =>
        course ? field.onChange(course.id) : field.onChange(undefined)
      }
      getItemLabel={(course) => `${course.title}`}
      defaultItem={defaultCourse}
    />
  );
};

export default SearchCourses;
