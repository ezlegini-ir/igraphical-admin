import { auth } from "@/auth";
import prisma from "@/prisma/client";

export const getUserByIdentifier = async (identifier: string) => {
  return await prisma.user.findFirst({
    where: {
      OR: [{ phone: identifier }, { email: identifier }],
    },
    include: {
      adminPassword: true,
    },
  });
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
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
