"use server";

import { prisma } from "@igraphical/core";
import { Prisma } from "@prisma/client";

export const getTutorByIdentifier = async (identifier: string) => {
  return await prisma.tutor.findFirst({
    where: {
      OR: [{ phone: identifier }, { email: identifier }],
    },
  });
};

export const searchTutors = async (query: string) => {
  const where: Prisma.TutorWhereInput = query
    ? {
        OR: [
          { email: { contains: query } },
          { phone: { contains: query } },
          { name: { contains: query } },
        ],
      }
    : {};

  return await prisma.tutor.findMany({
    where,
    take: 5,
  });
};

export const getTutorById = async (id: number) => {
  if (!id) return;
  return await prisma.tutor.findUnique({
    where: {
      id,
    },
  });
};

export const getAllTutors = async () => {
  return await prisma.tutor.findMany({
    include: { image: true },
  });
};
