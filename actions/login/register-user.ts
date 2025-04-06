"use server";

import { newUserFormSchema, NewUserFormType } from "@/lib/validationSchema";
import { prisma } from "@igraphical/core";

export async function registerUser(options: NewUserFormType) {
  const { email, firstName, lastName, nationalId, phone } = options;

  //  FORM VALIDATION
  const validation = newUserFormSchema.safeParse(options);
  if (!validation.success) return { error: "Form Inputs Not Valid" };

  // USER LOOKUP
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { nationalId }, { phone }],
    },
  });

  if (existingUser && existingUser.email === email)
    return { error: "با این ایمیل کاربری از قبل وجود دارد." };

  if (existingUser && existingUser.phone === phone)
    return { error: "با این شماره تماس کاربری از قبل وجود دارد." };

  if (existingUser && existingUser.nationalId === nationalId)
    return { error: "با این کد ملی کاربری از قبل وجود دارد." };

  // CREATE USER
  await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      nationalId,
      phone,
    },
  });

  return { success: "User Created Successfully" };
}
