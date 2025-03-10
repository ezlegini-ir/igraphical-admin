"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createCourse, updateCourse } from "@/actions/course";
import { Form } from "@/components/ui/form";
import useError from "@/hooks/useError";
import useLoading from "@/hooks/useLoading";
import useSuccess from "@/hooks/useSuccess";
import { CourseFormType, courseFormSchema } from "@/lib/validationSchema";
import {
  Course,
  CourseCategory,
  Curriculum,
  Discount,
  GalleryItem,
  Image as ImageType,
  Learn,
  Lesson,
  Prerequisite,
  Tutor,
} from "@prisma/client";
import { addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CourseFormBody from "./CourseFormBody";
import CourseFormSidebar from "./CourseFormSidebar";

export interface TutorType extends Tutor {
  image: ImageType | null;
}

export interface CourseType extends Course {
  tutor: Tutor | null;
  image: ImageType | null;
  learn: Learn[];
  prerequisite: Prerequisite[];
  discount: Discount | null;
  curriculum: (Curriculum & { lessons: Lesson[] })[];
  gallery: (GalleryItem & { image: ImageType[] }) | null;
}

interface Props {
  type: "NEW" | "UPDATE";
  course?: CourseType | null;
  tutors: TutorType[];
  categories: CourseCategory[];
}

const CourseForm = ({ type, course, tutors, categories }: Props) => {
  // HOOKS
  const router = useRouter();
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();

  const { success, setSuccess } = useSuccess();
  const [disocuntDateEnabled, setDiscountDateEnabled] = useState(
    !!course?.discount?.from || !!course?.discount?.to
  );
  const [galleryPreviews, setGalleryPreviews] = useState<
    { public_id?: string; url: string }[] | undefined
  >();

  // CONSTS
  const isUpdateType = type === "UPDATE";

  const form = useForm<CourseFormType>({
    resolver: zodResolver(courseFormSchema),
    mode: "onChange",
    defaultValues: {
      title: course?.title || "",
      categoryId: course?.categoryId?.toString() || "",
      description: course?.description || "",
      url: course?.url || "",
      duration: course?.duration || 0,
      image: undefined,
      needs: course?.needs || "",
      audience: course?.audience || "",
      jobMarket: course?.jobMarket || "",
      tutorId: course?.tutorId?.toString() || "",
      learns: course?.learn || [{ value: "" }],
      prerequisite: course?.prerequisite || [{ value: "" }],
      basePrice: course?.basePrice || 0,
      status: course?.status === "DRAFT" ? "0" : "1",
      summary: course?.summary || "",
      tizerUrl: course?.tizerUrl || "",
      discount: course?.discount
        ? {
            amount: course?.discount?.amount || 0,
            type: course?.discount?.type,
            date: disocuntDateEnabled
              ? {
                  from: course?.discount?.from || new Date(),
                  to: course?.discount?.to || addDays(new Date(), 4),
                }
              : {
                  from: new Date(),
                  to: addDays(new Date(), 4),
                },
          }
        : {
            amount: 0,
            type: "FIXED",
            date: {
              from: new Date(),
              to: addDays(new Date(), 4),
            },
          },
      curriculum: course?.curriculum?.length
        ? course.curriculum.map((section) => ({
            sectionTitle: section.sectionTitle || "",
            lessons: section.lessons?.length
              ? section.lessons.map((lesson) => ({
                  title: lesson.title,
                  duration: lesson.duration || 0,
                  url: lesson.url,
                  isFree: lesson.isFree,
                  type: lesson.type,
                }))
              : [
                  {
                    title: "",
                    duration: 0,
                    url: "",
                    isFree: false,
                    type: "VIDEO",
                  },
                ],
          }))
        : [
            {
              sectionTitle: "",
              lessons: [
                {
                  title: "",
                  duration: 0,
                  url: "",
                  isFree: false,
                  type: "VIDEO",
                },
              ],
            },
          ],
    },
  });

  const onSubmit = async (data: CourseFormType) => {
    setError("");
    setSuccess("");
    setLoading(true);

    const res = isUpdateType
      ? await updateCourse(data, course?.id!)
      : await createCourse(data);

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      if (isUpdateType) {
        setLoading(false);
        setSuccess(res.success);
        setGalleryPreviews([]);
        form.setValue("gallery", undefined);
        router.refresh();
      } else {
        router.push(`/courses/${res.course.id}`);
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          className="grid grid-cols-12 gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CourseFormBody form={form} type={type} course={course} />

          <CourseFormSidebar
            categories={categories}
            disocuntDateEnabled={disocuntDateEnabled}
            error={error}
            form={form}
            galleryPreviews={galleryPreviews}
            loading={loading}
            setDiscountDateEnabled={setDiscountDateEnabled}
            setError={setError}
            setGalleryPreviews={setGalleryPreviews}
            success={success}
            tutors={tutors}
            type={type}
            course={course}
          />
        </form>
      </Form>
    </>
  );
};

export default CourseForm;
