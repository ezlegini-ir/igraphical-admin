import { prisma } from "@igraphical/core";

export const getOtpByIdentifier = async (identifier: string) => {
  return await prisma.otp.findFirst({
    where: {
      identifier,
    },
  });
};
