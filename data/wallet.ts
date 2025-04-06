"use server";

import { prisma } from "@igraphical/core";

export const getWalletByUserId = async (userId: number) => {
  return await prisma.wallet.findFirst({
    where: { userId },
  });
};
