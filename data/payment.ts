"use server";

import prisma from "@/prisma/client";

export const getPaymentById = async (id: number) => {
  return await prisma.enrollment.findMany({
    where: { id },
  });
};
