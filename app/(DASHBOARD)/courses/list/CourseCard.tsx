import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { placeHolder } from "@/public";
import { Eye, Pencil, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CourseType } from "./CoursesList";
import Avatar from "@/components/Avatar";

interface Props {
  course: CourseType;
}

const CourseCard = ({ course }: Props) => {
  return (
    <div className="card p-3">
      <div className="relative">
        <Image
          alt=""
          src={course.image?.url || placeHolder}
          width={330}
          height={330}
          className="object-cover aspect-video rounded-sm w-full"
        />

        {course.status === "DRAFT" && (
          <Badge
            className="absolute top-0 left-0 w-full rounded-sm bg-slate-50/85"
            variant={"gray"}
          >
            {course.status}
          </Badge>
        )}
      </div>

      <div dir="rtl" className="space-y-1 flex justify-between">
        <h5>{course.title}</h5>
        <div className="flex gap-1 items-center">
          <span className="font-medium text-sm">{5}</span>
          <Star fill="#facc15" className="text-yellow-400" size={16} />
        </div>
      </div>

      <ul>
        <>
          <li className="flex justify-between py-2 text-gray-500 text-sm">
            <span>Tutor</span>
            <span className="flex items-center gap-1">
              <Avatar src={course.tutor.image?.url} size={20} />
              <span>{course.tutor.name}</span>
            </span>
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

      <div className="flex text-gray-500">
        <Link
          href={`${process.env.NEXT_PUBLIC_MAIN_URL}/courses/${course.url}`}
          className="w-full"
        >
          <Button variant={"ghost"} className="w-full">
            <Eye />
            View
          </Button>
        </Link>

        <Link href={`/courses/${course.id}`} className="w-full">
          <Button variant={"ghost"} className="w-full">
            <Pencil />
            Edit
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
