"use server";

import { prisma } from "@igraphical/core";

interface GetAllPostImagesOptions {
  take?: number;
  skip?: number;
}

export const getAllAssetImages = async (options?: GetAllPostImagesOptions) => {
  return await prisma.image.findMany({
    where: {
      type: { in: ["POST_ASSET", "POST"] },
    },
    orderBy: { id: "desc" },
    take: options?.take,
  });
};

export const getAllAssetImagesCount = async () => {
  return await prisma.image.count({
    where: {
      type: { in: ["POST_ASSET", "POST"] },
    },
  });
};
