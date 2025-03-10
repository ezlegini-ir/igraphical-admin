import Pagination from "@/components/Pagination";
import CourseCard from "./CourseCard";
import {
  Course,
  CourseCategory,
  Curriculum,
  Image,
  Lesson,
  Tutor,
} from "@prisma/client";

export interface CourseType extends Course {
  image: Image | null;
  tutor: (Tutor & { image: Image | null }) | null;
  category: CourseCategory | null;
  curriculum: (Curriculum & { lessons: Lesson[] })[];
}

interface Props {
  courses: CourseType[];
  totalCourses: number;
  pageSize: number;
}

const CoursesList = async ({ courses, totalCourses, pageSize }: Props) => {
  return (
    <div className="card p-8">
      {courses.length === 0 && (
        <div className="text-center py-10">No Courses Found</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
        {courses.map((course, index) => (
          <div key={index} className="col-span-1 md:col-span-3 ">
            <CourseCard course={course} />
          </div>
        ))}
      </div>
      <Pagination pageSize={pageSize} totalItems={totalCourses} />
    </div>
  );
};

export default CoursesList;
