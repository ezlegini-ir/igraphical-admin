import prisma from "@/prisma/client";

export const getTutorByIdentifier = async (identifier: string) => {
  return await prisma.tutor.findFirst({
    where: {
      OR: [{ phone: identifier }, { email: identifier }],
    },
  });
};

export const getTutorById = async (id: number) => {
  if (!id) return;
  return await prisma.tutor.findUnique({
    where: {
      id,
    },
  });
};

export const getAllTutors = async () => {
  return await prisma.tutor.findMany({
    include: { image: true },
  });
};
