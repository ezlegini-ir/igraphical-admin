import Pagination from "@/components/Pagination";
import CourseCard, { Course } from "./CourseCard";

interface Props {
  courses: Course[];
  totalCourses: number;
  pageSize: number;
}

const CoursesList = async ({ courses, totalCourses, pageSize }: Props) => {
  return (
    <div className="card p-8">
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
