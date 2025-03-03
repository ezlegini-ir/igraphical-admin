import prisma from "@/prisma/client";

export const getTutorByIdentifier = async (identifier: string) => {
  return await prisma.tutor.findFirst({
    where: {
      OR: [{ phone: identifier }, { email: identifier }],
    },
  });
};

export const getTutorById = async (id: string) => {
  if (!id) return;
  return await prisma.tutor.findUnique({
    where: {
      id,
    },
  });
};
