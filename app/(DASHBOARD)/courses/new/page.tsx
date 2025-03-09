import CourseForm from "@/components/forms/dashboard/course/CourseForm";
import { getAllTutors } from "@/data/tutor";

const page = async () => {
  const tutors = await getAllTutors();

  return (
    <div className="space-y-3">
      <h3>Create a Course</h3>

      <CourseForm type="NEW" tutors={tutors} />
    </div>
  );
};

export default page;
