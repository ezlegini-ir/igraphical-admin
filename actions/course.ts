"use server";

import { getCourseByUrl } from "@/data/course";
import { encodeUrl } from "@/lib/utils";
import { CourseFormType } from "@/lib/validationSchema";
import { prisma } from "@igraphical/core";
import { DiscountType } from "@prisma/client";
import { UploadApiResponse } from "cloudinary";
import {
  deleteCloudFile,
  deleteManyCloudFiles,
  uploadCloudFile,
  uploadManyCloudFiles,
} from "./cloudinary";

function discountedPrice(
  basePrice: number,
  discountType: DiscountType,
  discountAmount: number
): number {
  let discountedPrice: number;

  if (discountType === "FIXED") {
    discountedPrice = basePrice - discountAmount;
  } else {
    discountedPrice = basePrice - (discountAmount / 100) * basePrice;
  }

  return Math.max(discountedPrice, 0); // Prevent negative prices
}

//* CREATE ------------------------------------------------------------

export const createCourse = async (data: CourseFormType) => {
  const {
    categoryId,
    description,
    duration,
    tutorId,
    learns,
    basePrice,
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
    audience,
    jobMarket,
    needs,
  } = data;

  const price = discount
    ? discountedPrice(basePrice, discount.type, discount.amount)
    : basePrice;

  try {
    const encodedUrl = encodeUrl(url);
    const existingCourse = await getCourseByUrl(encodedUrl);

    if (existingCourse)
      return { error: "There Already is a post with this URL" };

    const newCourse = await prisma.$transaction(async (tx) => {
      const course = await tx.course.create({
        data: {
          title,
          url: encodedUrl,
          summary,
          description,
          tizerUrl,
          duration,
          basePrice,
          price,
          audience,
          jobMarket,
          needs,
          status: status === "0" ? "DRAFT" : "PUBLISHED",

          category: {
            connect: { id: +categoryId },
          },

          // Instructor
          tutor: {
            connect: { id: +tutorId },
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
          discount:
            discount && discount.amount !== 0
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

      // Upload course image
      if (image && image instanceof File) {
        const buffer = Buffer.from(await image.arrayBuffer());

        const { secure_url, public_id, format, bytes } = (await uploadCloudFile(
          buffer,
          {
            folder: "course",
            width: 800,
          }
        )) as UploadApiResponse;

        await tx.image.create({
          data: {
            url: secure_url,
            public_id,
            format,
            type: "COURSE",
            size: bytes,
            course: {
              connect: {
                id: course.id,
              },
            },
          },
        });
      }

      // Upload gallery images
      if (gallery) {
        const buffers = await Promise.all(
          gallery.map(async (item) => Buffer.from(await item.arrayBuffer()))
        );

        const uploadedGallery = (await uploadManyCloudFiles(buffers, {
          folder: "course",
          width: 800,
        })) as UploadApiResponse[];

        const newGallery = await tx.galleryItem.create({
          data: {
            course: {
              connect: {
                id: newCourse.id,
              },
            },
          },
        });

        await tx.image.createMany({
          data: uploadedGallery.map(
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

      return course;
    });

    return { success: "Course Created Successfully", course: newCourse };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//? UPDATE ------------------------------------------------------------

export const updateCourse = async (data: CourseFormType, id: number) => {
  const {
    categoryId,
    description,
    duration,
    tutorId,
    learns,
    basePrice,
    status,
    summary,
    title,
    tizerUrl,
    url,
    curriculum,
    audience,
    jobMarket,
    needs,
    discount,
    gallery,
    image,
    prerequisite,
  } = data;

  const price = discount
    ? discountedPrice(basePrice, discount.type, discount.amount)
    : basePrice;

  try {
    const encodedUrl = encodeUrl(url);
    const existingCourseByUrl = await getCourseByUrl(encodedUrl);
    if (existingCourseByUrl && existingCourseByUrl.id !== id) {
      return { error: "There already is a post with this URL" };
    }

    const updatedCourse = await prisma.$transaction(async (tx) => {
      // Update main course fields.
      const course = await tx.course.update({
        where: { id },
        data: {
          title,
          url: encodedUrl,
          summary,
          description,
          tizerUrl,
          duration,
          basePrice,
          price,
          audience,
          jobMarket,
          category: { connect: { id: +categoryId } },
          needs,
          status: status === "0" ? "DRAFT" : "PUBLISHED",
          tutor: { connect: { id: +tutorId } },
        },
        include: { image: true },
      });

      // Update Learn Sections.
      await tx.learn.deleteMany({ where: { courseId: id } });
      if (learns?.length) {
        await tx.learn.createMany({
          data: learns.map((learn) => ({ ...learn, courseId: id })),
        });
      }

      // Update Prerequisites.
      await tx.prerequisite.deleteMany({ where: { courseId: id } });
      if (prerequisite?.length) {
        await tx.prerequisite.createMany({
          data: prerequisite.map((prereq) => ({ ...prereq, courseId: id })),
        });
      }

      // Update Discount.
      if (discount && discount.amount !== 0) {
        await tx.discount.upsert({
          where: { courseId: id },
          update: {
            amount: discount.amount,
            type: discount.type,
            from: discount.date ? discount.date.from : null,
            to: discount.date ? discount.date.to : null,
          },
          create: {
            amount: discount.amount,
            type: discount.type,
            from: discount.date ? discount.date.from : null,
            to: discount.date ? discount.date.to : null,
            course: { connect: { id } },
          },
        });
      } else {
        const existingDiscount = await prisma.discount.findUnique({
          where: { courseId: id },
        });
        if (existingDiscount) {
          await tx.discount.delete({ where: { courseId: id } });
        }
      }

      // Update Curriculum Sections and Lessons:
      // First, fetch existing curriculum sections for the course.
      const existingSections = await tx.curriculum.findMany({
        where: { courseId: id },
      });
      const inputSectionIds: number[] = [];
      if (curriculum?.length) {
        for (const section of curriculum) {
          let sectionRecord;
          if (section.id) {
            // If section exists, update its title.
            sectionRecord = await tx.curriculum.update({
              where: { id: section.id },
              data: { sectionTitle: section.sectionTitle },
            });
          } else {
            // Create a new section.
            sectionRecord = await tx.curriculum.create({
              data: {
                sectionTitle: section.sectionTitle,
                course: { connect: { id } },
              },
            });
          }
          inputSectionIds.push(sectionRecord.id);

          // Process lessons for this section.
          // Get existing lessons for the current section.
          const existingLessons = await tx.lesson.findMany({
            where: { sectionId: sectionRecord.id },
          });
          const inputLessonIds: number[] = [];
          if (section.lessons?.length) {
            for (const lesson of section.lessons) {
              let lessonRecord;
              if (lesson.id) {
                // Update existing lesson.
                lessonRecord = await tx.lesson.update({
                  where: { id: lesson.id },
                  data: {
                    title: lesson.title,
                    duration: lesson.duration || null,
                    url: lesson.url,
                    isFree: lesson.isFree,
                    type: lesson.type,
                    sectionId: sectionRecord.id,
                  },
                });
              } else {
                // Create new lesson.
                lessonRecord = await tx.lesson.create({
                  data: {
                    title: lesson.title,
                    duration: lesson.duration || null,
                    url: lesson.url,
                    isFree: lesson.isFree,
                    type: lesson.type,
                    sectionId: sectionRecord.id,
                  },
                });
              }
              inputLessonIds.push(lessonRecord.id);
            }
          }
          // Remove lessons that exist in DB but were not included in the input.
          const lessonsToDelete = existingLessons.filter(
            (les) => !inputLessonIds.includes(les.id)
          );
          for (const lessonToDelete of lessonsToDelete) {
            await tx.lesson.delete({ where: { id: lessonToDelete.id } });
          }
        }
      }
      // Remove sections that exist in DB but were not included in the input.
      const sectionsToDelete = existingSections.filter(
        (sec) => !inputSectionIds.includes(sec.id)
      );
      for (const sectionToDelete of sectionsToDelete) {
        // Optionally, delete any lessons in the section (if cascade delete isn’t enabled).
        await tx.lesson.deleteMany({
          where: { sectionId: sectionToDelete.id },
        });
        await tx.curriculum.delete({
          where: { id: sectionToDelete.id },
        });
      }

      // Update Main Image.
      if (image && image instanceof File) {
        const buffer = Buffer.from(await image.arrayBuffer());

        const { secure_url, public_id, format, bytes } = (await uploadCloudFile(
          buffer,
          { folder: "course", width: 800 }
        )) as UploadApiResponse;

        if (course.image) {
          await deleteCloudFile(course.image.public_id);
        }

        await tx.image.upsert({
          where: { courseId: course.id },
          update: {
            public_id,
            url: secure_url,
            format,
            size: bytes,
          },
          create: {
            type: "COURSE",
            public_id,
            url: secure_url,
            format,
            size: bytes,
            course: { connect: { id: course.id } },
          },
        });
      }

      // Update Gallery.
      if (gallery) {
        const buffers = await Promise.all(
          gallery.map(async (item) => Buffer.from(await item.arrayBuffer()))
        );
        const uploadedGallery = (await uploadManyCloudFiles(buffers, {
          folder: "course",
          width: 800,
        })) as UploadApiResponse[];

        let courseGallery = await tx.galleryItem.findFirst({
          where: { courseId: id },
        });

        if (!courseGallery) {
          courseGallery = await tx.galleryItem.create({
            data: { course: { connect: { id } } },
          });
        }

        await tx.image.createMany({
          data: uploadedGallery.map(
            ({ secure_url, bytes, format, public_id }) => ({
              url: secure_url,
              public_id,
              format,
              type: "COURSE",
              size: bytes,
              galleryId: courseGallery!.id,
            })
          ),
        });
      }

      return course;
    });

    return { success: "Course Updated Successfully", course: updatedCourse };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

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
      await deleteCloudFile(deletedCourse.image?.public_id);
    }

    const public_ids = deletedCourse.gallery?.image.map((img) => img.public_id);
    if (public_ids) {
      await deleteManyCloudFiles(public_ids);
    }

    return { success: "Course Remvoed Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

// export const updateCourse = async (data: CourseFormType, id: number) => {
//   const {
//     categoryId,
//     description,
//     duration,
//     tutorId,
//     learns,
//     basePrice,
//     status,
//     summary,
//     title,
//     tizerUrl,
//     url,
//     curriculum,
//     audience,
//     jobMarket,
//     needs,
//     discount,
//     gallery,
//     image,
//     prerequisite,
//   } = data;

//   const price = discount
//     ? discountedPrice(basePrice, discount.type, discount.amount)
//     : basePrice;

//   try {
//     const encodedUrl = encodeUrl(url);
//     const existingCourseByUrl = await getCourseByUrl(encodedUrl);
//     if (existingCourseByUrl && existingCourseByUrl.id !== id) {
//       return { error: "There already is a post with this URL" };
//     }

//     const updatedCourse = await prisma.$transaction(async (tx) => {
//       const course = await tx.course.update({
//         where: { id },
//         data: {
//           title,
//           url: encodedUrl,
//           summary,
//           description,
//           tizerUrl,
//           duration,
//           basePrice,
//           price,
//           audience,
//           jobMarket,
//           category: { connect: { id: +categoryId } },
//           needs,
//           status: status === "0" ? "DRAFT" : "PUBLISHED",
//           tutor: { connect: { id: +tutorId } },
//         },
//         include: { image: true },
//       });

//       // Update Learn Sections:
//       await tx.learn.deleteMany({ where: { courseId: id } });
//       if (learns?.length) {
//         await tx.learn.createMany({
//           data: learns.map((learn) => ({ ...learn, courseId: id })),
//         });
//       }

//       // Update Prerequisites:
//       await tx.prerequisite.deleteMany({ where: { courseId: id } });
//       if (prerequisite?.length) {
//         await tx.prerequisite.createMany({
//           data: prerequisite.map((prereq) => ({ ...prereq, courseId: id })),
//         });
//       }

//       // Update Discount:
//       if (discount && discount.amount !== 0) {
//         await tx.discount.upsert({
//           where: { courseId: id },
//           update: {
//             amount: discount.amount,
//             type: discount.type,
//             from: discount.date ? discount.date?.from : null,
//             to: discount.date ? discount.date?.to : null,
//           },
//           create: {
//             amount: discount.amount,
//             type: discount.type,
//             from: discount.date ? discount.date?.from : null,
//             to: discount.date ? discount.date?.to : null,
//             course: { connect: { id } },
//           },
//         });
//       } else {
//         const existingDiscount = await prisma.discount.findUnique({
//           where: { courseId: id },
//         });
//         if (existingDiscount) {
//           await tx.discount.delete({ where: { courseId: id } });
//         }
//       }

//       // Update Curriculum:
//       await tx.curriculum.deleteMany({ where: { courseId: id } });

//       if (curriculum?.length) {
//         for (const section of curriculum) {
//           const newSection = await tx.curriculum.create({
//             data: {
//               sectionTitle: section.sectionTitle,
//               course: { connect: { id } },
//             },
//           });
//           if (section.lessons?.length) {
//             await tx.lesson.createMany({
//               data: section.lessons.map((lesson) => ({
//                 title: lesson.title,
//                 duration: lesson.duration || null,
//                 url: lesson.url,
//                 isFree: lesson.isFree,
//                 type: lesson.type,
//                 sectionId: newSection.id,
//               })),
//             });
//           }
//         }
//       }

//       // Update Main Image:
//       if (image && image instanceof File) {
//         const buffer = Buffer.from(await image.arrayBuffer());

//         const { secure_url, public_id, format, bytes } = (await uploadCloudFile(
//           buffer,
//           {
//             folder: "course",
//             width: 800,
//           }
//         )) as UploadApiResponse;

//         if (course.image) {
//           await deleteCloudFile(course.image.public_id);
//         }

//         await tx.image.upsert({
//           where: {
//             courseId: course.id,
//           },
//           update: {
//             public_id,
//             url: secure_url,
//             format,
//             size: bytes,
//           },
//           create: {
//             type: "COURSE",
//             public_id,
//             url: secure_url,
//             format,
//             size: bytes,
//             course: {
//               connect: { id: course.id },
//             },
//           },
//         });
//       }

//       // Update Gallery:
//       if (gallery) {
//         const buffers = await Promise.all(
//           gallery.map(async (item) => Buffer.from(await item.arrayBuffer()))
//         );

//         const uploadedGallery = (await uploadManyCloudFiles(buffers, {
//           folder: "course",
//           width: 800,
//         })) as UploadApiResponse[];

//         let courseGallery = await tx.galleryItem.findFirst({
//           where: { courseId: id },
//         });

//         if (!courseGallery) {
//           courseGallery = await tx.galleryItem.create({
//             data: { course: { connect: { id } } },
//           });
//         }

//         await tx.image.createMany({
//           data: uploadedGallery.map(
//             ({ secure_url, bytes, format, public_id }) => ({
//               url: secure_url,
//               public_id,
//               format,
//               type: "COURSE",
//               size: bytes,
//               galleryId: courseGallery!.id,
//             })
//           ),
//         });
//       }

//       return course;
//     });

//     return { success: "Course Updated Successfully", course: updatedCourse };
//   } catch (error) {
//     return { error: "Error 500: " + error };
//   }
// };
