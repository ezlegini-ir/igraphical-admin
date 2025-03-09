"use server";

import { getCourseByUrl } from "@/data/course";
import { encodeUrl } from "@/lib/utils";
import { CourseFormType } from "@/lib/validationSchema";
import prisma from "@/prisma/client";
import { UploadApiResponse } from "cloudinary";
import {
  deleteCloudImage,
  deleteManyCloudImages,
  uploadCloudImage,
  uploadManyCloudImages,
} from "./cloudinary";

//* CREATE ------------------------------------------------------------

export const createCourse = async (data: CourseFormType) => {
  const {
    categoryId,
    description,
    duration,
    tutorId: instructorId,
    learns,
    price,
    status,
    summary,
    title,
    tizerUrl,
    url,
    curriculum,
    discount,
    gallery,
    image,
    prerequisite,
  } = data;

  try {
    const encodedUrl = encodeUrl(url);

    const existingCourse = await getCourseByUrl(encodedUrl);

    if (existingCourse)
      return { error: "There Already is a post with this URL" };

    const newCourse = await prisma.course.create({
      data: {
        title,
        url,
        summary,
        description,
        tizerUrl,
        duration,
        categoryId,
        price,
        status: status === "0" ? "DRAFT" : "PUBLISHED",

        // Instructor
        tutor: {
          connect: { id: +instructorId },
        },

        // Learn Sections
        learn: {
          createMany: {
            data: learns?.length ? learns : [],
          },
        },

        // Prerequisites
        prerequisite: {
          createMany: {
            data: prerequisite?.length ? prerequisite : [],
          },
        },

        // Discount
        discount: discount
          ? {
              create: {
                amount: discount.amount,
                type: discount.type,
                from: discount.date?.from,
                to: discount.date?.to,
              },
            }
          : undefined,

        // Curriculum
        curriculum: curriculum?.length
          ? {
              create: curriculum.map((section) => ({
                sectionTitle: section.sectionTitle,
                lessons: {
                  create: section.lessons.map((lesson) => ({
                    title: lesson.title,
                    duration: lesson.duration || null,
                    url: lesson.url,
                    isFree: lesson.isFree,
                    type: lesson.type,
                  })),
                },
              })),
            }
          : undefined,
      },
    });

    if (image && image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());

      const { secure_url, public_id, format, bytes } = (await uploadCloudImage(
        buffer,
        {
          folder: "course",
          width: 800,
        }
      )) as UploadApiResponse;

      // CREATE IMAGE
      await prisma.image.create({
        data: {
          url: secure_url,
          public_id,
          format,
          type: "COURSE",
          size: bytes,
          course: {
            connect: {
              id: newCourse.id,
            },
          },
        },
      });
    }

    if (gallery) {
      const buffers = await Promise.all(
        gallery.map(async (item) => Buffer.from(await item.arrayBuffer()))
      );

      const uplaodedGallery = (await uploadManyCloudImages(buffers, {
        folder: "course",
        width: 800,
      })) as UploadApiResponse[];

      const newGallery = await prisma.galleryItem.create({
        data: {
          course: {
            connect: {
              id: newCourse.id,
            },
          },
        },
      });

      await prisma.image.createMany({
        data: uplaodedGallery.map(
          ({ secure_url, bytes, format, public_id }) => ({
            url: secure_url,
            public_id,
            format,
            type: "COURSE",
            size: bytes,
            galleryId: newGallery.id,
          })
        ),
      });
    }

    return { success: "Course Created Successfully", course: newCourse };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//? UPDATE ------------------------------------------------------------

//! DELETE ------------------------------------------------------------

export const deleteCourse = async (id: number) => {
  try {
    const deletedCourse = await prisma.course.delete({
      where: { id },
      include: {
        image: true,
        gallery: {
          include: {
            image: true,
          },
        },
      },
    });

    // DELETE IMAGES
    if (deletedCourse.image) {
      await deleteCloudImage(deletedCourse.image?.public_id);
    }

    const public_ids = deletedCourse.gallery?.image.map((img) => img.public_id);
    if (public_ids) {
      await deleteManyCloudImages(public_ids);
    }

    return { success: "Course Remvoed Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};
