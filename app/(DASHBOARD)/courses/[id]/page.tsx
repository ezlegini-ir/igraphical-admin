import CourseForm, {
  CourseProps,
} from "@/components/forms/dashboard/course/CourseForm";
import { coursePic } from "@/public";
import { addDays } from "date-fns";

const page = () => {
  return (
    <div className="space-y-3">
      <h3>Create New Course</h3>

      <CourseForm type="UPDATE" course={course} />
    </div>
  );
};

const course: CourseProps = {
  title: "دوره جامع نرم افزار ادوبی ایلوستریتور",
  category: "1",
  description: "دوره خوبیه",
  duration: 2314,
  image: { url: coursePic },
  instructor: "alireza-ezlegini",
  learns: [{ value: "چیز های جدید" }, { value: "666" }],
  price: 1273000,
  status: "0",
  summery: "خلاصه",
  tizerUrl: "URL",
  url: "دوره-ایلوستریتور",
  discount: {
    amount: 50,
    type: "PERCENT",
    date: {
      from: new Date(),
      to: addDays(new Date(), 4),
    },
  },
  prerequisite: [{ value: "پیش نیاز" }],
};

export default page;
