"use server";

import { prisma } from "@igraphical/core";

export const getPaymentById = async (id: number) => {
  return await prisma.enrollment.findMany({
    where: { id },
  });
};
