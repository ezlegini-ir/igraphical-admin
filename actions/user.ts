"use server";

import { getUserById } from "@/data/user";
import { studentFormSchema, StudentFormType } from "@/lib/validationSchema";
import prisma from "@/prisma/client";

export async function registerUser(data: StudentFormType) {
  const { email, firstName, lastName, nationalId, phone } = data;

  try {
    //  FORM VALIDATION
    const validation = studentFormSchema.safeParse(data);
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
        nationalId: nationalId || "0000000000",
        phone,
      },
    });

    return { success: "User Created Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
}

export const updateUser = async (data: StudentFormType, id: number) => {
  const { email, firstName, lastName, phone, nationalId } = data;

  try {
    const existingStudent = await getUserById(id);
    if (!existingStudent) return { error: "No Admin Found" };

    if (id !== existingStudent.id) {
      if (existingStudent && existingStudent.email === email)
        return { error: "User with this Email Already Exists." };

      if (existingStudent && existingStudent.phone === phone)
        return { error: "User with this Phone Already Exists." };
    }

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        firstName,
        nationalId,
        lastName,
        id,
        email,
        phone,
      },
    });

    return { success: "Updated Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

export const deleteUser = async (id: number) => {
  try {
    const existingAdmin = await getUserById(id);
    if (!existingAdmin) return { error: "No Admin Found" };

    await prisma.user.delete({
      where: { id },
    });

    return { success: "Deleted Successfully" };
  } catch (error) {
    return { error: "500: " + error };
  }
};
