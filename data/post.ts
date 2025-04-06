"use server";

import { prisma } from "@igraphical/core";

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
