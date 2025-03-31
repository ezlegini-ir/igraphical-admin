"use server";

import prisma from "@/prisma/client";

export const getWalletByUserId = async (userId: number) => {
  return await prisma.wallet.findFirst({
    where: { userId },
  });
};
