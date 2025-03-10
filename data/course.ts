"use server";

import prisma from "@/prisma/client";

export const getCourseByUrl = async (url: string) => {
  return await prisma.course.findUnique({
    where: { url },
  });
};

export const getCourseById = async (id: string | number) => {
  return await prisma.course.findUnique({
    where: { id: +id },
    include: {
      discount: true,
      gallery: {
        include: {
          image: true,
        },
      },
      image: true,
      tutor: true,
      learn: true,
      category: true,
      prerequisite: true,
      curriculum: {
        include: {
          lessons: true,
        },
      },
    },
  });
};
