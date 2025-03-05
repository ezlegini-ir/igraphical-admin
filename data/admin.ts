import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";

export const getAdmins = async () => {
  return await prisma.admin.findMany();
};

export const getAdminByIdentifier = async (identifier: string) => {
  return await prisma.admin.findFirst({
    where: {
      OR: [{ phone: identifier }, { email: identifier }],
    },
  });
};

export const getAdminById = async (id: string | number) => {
  return await prisma.admin.findUnique({
    where: {
      id: +id,
    },
    include: { image: true },
  });
};

export const getSessionAdmin = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return userId ? await getAdminById(userId) : null;
};

export const redirectAdmin = async () => {
  const admin = await getSessionAdmin();

  if (admin?.role === "TUTOR") redirect("/tutor");
  else redirect("/");
};
