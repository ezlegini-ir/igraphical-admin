"use server";

import { prisma } from "@igraphical/core";

export const searchUsers = async (query: string) => {
  const where = query
    ? {
        OR: [
          { email: { contains: query } },
          { phone: { contains: query } },
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { fullName: { contains: query } },
          { nationalId: { contains: query } },
        ],
      }
    : {};

  return await prisma.user.findMany({
    where,
    take: 5,
  });
};

export const searchPosts = async (query: string) => {
  const where = query
    ? {
        OR: [{ title: { contains: query } }, { url: { contains: query } }],
      }
    : {};

  return await prisma.post.findMany({
    where,
    take: 5,
  });
};

export const searchCourses = async (query: string) => {
  const where = query
    ? {
        OR: [{ title: { contains: query } }],
      }
    : {};

  return await prisma.course.findMany({
    where,
    take: 5,
  });
};
