import CourseForm, {
  CourseProps,
} from "@/components/forms/dashboard/course/CourseForm";
import { coursePic, profile, profile2 } from "@/public";

interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  // const { id } = await params;

  return (
    <div className="space-y-3">
      <h3>Update Course</h3>

      <CourseForm type="UPDATE" course={course} />
    </div>
  );
};

const course: CourseProps = {
  title: "Mastering Adobe Illustrator",
  url: "mastering-adobe-illustrator",
  summery:
    "A comprehensive course on Adobe Illustrator from beginner to advanced levels.",
  learns: [
    { value: "Understand the basics of vector graphics" },
    { value: "Create complex illustrations and designs" },
    { value: "Master advanced tools and features" },
  ],
  description:
    "This course covers all aspects of Adobe Illustrator, including tools, techniques, and best practices for design and illustration.",
  prerequisite: [
    { value: "Basic knowledge of graphic design principles" },
    { value: "Familiarity with design software is a plus" },
  ],
  status: "1",
  instructor: "alireza-ezlegini",
  tizerUrl: "https://example.com/videos/illustrator-teaser.mp4",
  duration: 25,
  image: { url: coursePic },
  gallery: [coursePic, profile, profile2],
  category: "1",
  price: 199.99,

  // Discount
  discount: {
    amount: 50,
    type: "PERCENT",
    date: {
      from: new Date("2024-09-01"),
      to: new Date("2024-09-30"),
    },
  },

  // Curriculum
  curriculum: [
    {
      sectionTitle: "Introduction to Illustrator",
      lessons: [
        {
          title: "Getting Started with Illustrator",
          duration: 10,
          url: "https://example.com/lessons/getting-started",
          isFree: true,
          type: "VIDEO",
        },
        {
          title: "Understanding the Interface",
          duration: 15,
          url: "https://example.com/lessons/interface",
          isFree: false,
          type: "FILE",
        },
      ],
    },
    {
      sectionTitle: "Advanced Techniques",
      lessons: [
        {
          title: "Working with Vector Tools",
          duration: 20,
          url: "https://example.com/lessons/vector-tools",
          isFree: true,
          type: "VIDEO",
        },
        {
          title: "Creating Complex Shapes",
          duration: 30,
          url: "https://example.com/lessons/complex-shapes",
          isFree: false,
          type: "ASSET",
        },
      ],
    },
  ],
};

export default page;
