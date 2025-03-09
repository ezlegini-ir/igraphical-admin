import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { placeHolder } from "@/public";
import { Eye, Pencil, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CourseType } from "./CoursesList";

interface Props {
  course: CourseType;
}

const CourseCard = ({ course }: Props) => {
  return (
    <div className="card p-3">
      <Image
        alt=""
        src={course.image?.url || placeHolder}
        width={350}
        height={350}
        className="object-cover aspect-video rounded-sm w-full"
      />

      <div dir="rtl" className="space-y-1">
        <h5>{course.title}</h5>
        <div className="flex gap-1 items-center">
          <Star fill="#facc15" className="text-yellow-400" size={20} />
          <span className="font-medium text-sm">{5}</span>
        </div>
      </div>

      <ul>
        <>
          <li className="flex justify-between py-2 text-gray-500 text-sm">
            <span>Tutor</span>
            <span>{course.tutor?.displayName}</span>
          </li>
          <Separator />
        </>
        <>
          <li className="flex justify-between py-2 text-gray-500 text-sm">
            <span>Students</span>
            <span>{(12332).toLocaleString("en-US")}</span>
          </li>
          <Separator />
        </>
        <>
          <li className="flex justify-between py-2 text-gray-500 text-sm">
            <span>Duration</span>
            <span>{course.duration.toLocaleString("en-US")}</span>
          </li>
          <Separator />
        </>
        <>
          <li className="flex justify-between py-2 text-gray-500 text-sm">
            <span>Price</span>
            <span className="text-primary font-semibold">
              {course.price === 0 ? (
                <Badge variant={"green"}>Free</Badge>
              ) : (
                course?.price.toLocaleString("en-US") + " T"
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
