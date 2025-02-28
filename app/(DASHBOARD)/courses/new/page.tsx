import CourseForm from "@/components/forms/dashboard/course/CourseForm";
import React from "react";

const page = () => {
  return (
    <div className="space-y-3">
      <h3>Create New Course</h3>

      <CourseForm type="UPDATE" />
    </div>
  );
};

export default page;
