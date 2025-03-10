import prisma from "@/prisma/client";

export async function getPostCategoryByUrl(url: string) {
  return await prisma.postCategory.findUnique({
    where: { url },
  });
}

export async function getCourseCategoryByUrl(url: string) {
  return await prisma.courseCategory.findUnique({
    where: { url },
  });
}

export async function getPostCategoryById(id: number) {
  return await prisma.postCategory.findUnique({
    where: { id },
  });
}

export async function getCourseCategoryById(id: number) {
  return await prisma.courseCategory.findUnique({
    where: { id },
  });
}
