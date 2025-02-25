import prisma from "@/prisma/client";

export const getOtpByIdentifier = async (identifier: string) => {
  return await prisma.otp.findFirst({
    where: {
      identifier,
    },
  });
};
