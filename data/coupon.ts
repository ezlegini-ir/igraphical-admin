"use server";

import prisma from "@/prisma/client";

export const getCouponByCode = async (code: string) => {
  return await prisma.coupon.findUnique({
    where: { code },
  });
};
