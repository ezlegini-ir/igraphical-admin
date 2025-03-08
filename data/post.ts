"use server";

import prisma from "@/prisma/client";

export async function getPostByUrl(url: string) {
  return await prisma.post.findUnique({
    where: { url },
  });
}

export async function getPostById(id: string | number) {
  return await prisma.post.findUnique({
    where: { id: +id },
    include: { image: true, categories: true, author: true },
  });
}

export async function getPostCategoryByUrl(url: string) {
  return await prisma.postCategory.findUnique({
    where: { url },
  });
}

export async function getPostCategoryById(id: number) {
  return await prisma.postCategory.findUnique({
    where: { id },
  });
}
