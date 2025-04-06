import CourseForm from "@/components/forms/dashboard/course/CourseForm/CourseForm";
import { getAllTutors } from "@/data/tutor";
import { prisma } from "@igraphical/core";

const page = async () => {
  const tutors = await getAllTutors();
  const categories = await prisma.courseCategory.findMany();

  return (
    <div className="space-y-3">
      <h3>Create a Course</h3>

      <CourseForm type="NEW" tutors={tutors} categories={categories} />
    </div>
  );
};

export default page;
