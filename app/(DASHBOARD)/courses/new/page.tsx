import CourseForm from "@/components/forms/dashboard/course/CourseForm";

const page = () => {
  return (
    <div className="space-y-3">
      <h3>Create a Course</h3>

      <CourseForm type="NEW" />
    </div>
  );
};

export default page;
