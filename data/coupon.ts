"use server";

import { prisma } from "@igraphical/core";

export const getCouponByCode = async (code: string) => {
  return await prisma.coupon.findUnique({
    where: { code },
    include: {
      courseExclude: true,
      courseInclude: true,
    },
  });
};
