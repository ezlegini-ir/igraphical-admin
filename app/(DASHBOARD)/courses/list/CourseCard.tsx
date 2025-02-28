import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, Pencil, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type Course = {
  id: number;
  title: string;
  rate: number;
  url: string;
  image: { url: string };
  info: {
    tutor: { name: string; id: number };
    students: number;
    duration: number;
    price: number;
  };
};

interface Props {
  course: Course;
}

const CourseCard = ({ course }: Props) => {
  return (
    <div className="card p-3">
      <Image
        alt=""
        src={course.image.url}
        width={350}
        height={350}
        className="object-cover aspect-video rounded-sm w-full"
      />

      <div dir="rtl" className="space-y-1">
        <h5>{course.title}</h5>
        <div className="flex gap-1 items-center">
          <Star fill="#facc15" className="text-yellow-400" size={20} />
          <span className="font-medium text-sm">{course.rate}</span>
        </div>
      </div>

      <ul>
        <>
          <li className="flex justify-between py-2 text-gray-500 text-sm">
            <span>Tutor</span>
            <span>{course.info.tutor.name}</span>
          </li>
          <Separator />
        </>
        <>
          <li className="flex justify-between py-2 text-gray-500 text-sm">
            <span>Students</span>
            <span>{course.info.students.toLocaleString("en-US")}</span>
          </li>
          <Separator />
        </>
        <>
          <li className="flex justify-between py-2 text-gray-500 text-sm">
            <span>Duration</span>
            <span>{course.info.duration.toLocaleString("en-US")}</span>
          </li>
          <Separator />
        </>
        <>
          <li className="flex justify-between py-2 text-gray-500 text-sm">
            <span>Price</span>
            <span className="text-primary font-semibold">
              {course.info.price === 0 ? (
                <Badge variant={"green"}>Free</Badge>
              ) : (
                course.info.price.toLocaleString("en-US") + " T"
              )}
            </span>
          </li>
          <Separator />
        </>
      </ul>

      <div className="flex gap-3 justify-between text-gray-500">
        <Link href={`/course/${course.url}`}>
          <Button variant={"ghost"}>
            <Eye />
            View
          </Button>
        </Link>

        <Link href={`/courses/${course.id}`}>
          <Button variant={"ghost"}>
            <Pencil />
            Edit
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
