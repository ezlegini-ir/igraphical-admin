"use server";

import { auth } from "@/auth";
import { prisma } from "@igraphical/core";

export const getUserByIdentifier = async (phoneOrEmail: string) => {
  return await prisma.user.findFirst({
    where: {
      OR: [{ phone: phoneOrEmail }, { email: phoneOrEmail }],
    },
  });
};

export const getUserById = async (id: number) => {
  return await prisma.admin.findUnique({
    where: {
      id,
    },
  });
};

export const getSessionUser = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return userId ? await getUserById(+userId) : null;
};
