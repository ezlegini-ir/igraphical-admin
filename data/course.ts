"use server";

import { prisma } from "@igraphical/core";

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

export const getAllCoursesByIds = async (ids: number[]) => {
  const validIds = ids.filter((id) => id !== 0 && id !== undefined);

  if (validIds.length === 0) return [];

  return await prisma.course.findMany({
    where: {
      id: { in: validIds },
    },
    include: {
      image: true,
      tutor: {
        include: {
          image: true,
        },
      },
    },
  });
};

export const getFirstCourseByIds = async (ids: number[]) => {
  return await prisma.course.findFirst({
    where: {
      OR: ids.map((id) => ({ id })),
    },
  });
};
