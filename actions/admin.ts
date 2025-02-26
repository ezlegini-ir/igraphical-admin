"use server";

import { getAdminById, getAdminByIdentifier } from "@/data/admin";
import { AdminFormType } from "@/lib/validationSchema";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";

export const updateAdmin = async (data: AdminFormType & { id: string }) => {
  const { displayName, email, id, name, phone, role, password } = data;

  try {
    const existingAdmin = await getAdminById(id);
    if (!existingAdmin) return { error: "No Admin Found" };

    if (id !== existingAdmin.id) {
      if (existingAdmin && existingAdmin.email === email)
        return { error: "User with this Email Already Exists." };

      if (existingAdmin && existingAdmin.phone === phone)
        return { error: "User with this Phone Already Exists." };
    }

    let hashedPassword;
    if (password) hashedPassword = await bcrypt.hash(password, 10);

    await prisma.admin.update({
      where: {
        id: existingAdmin.id,
      },
      data: {
        id,
        displayName,
        email,
        name,
        password: password ? hashedPassword : existingAdmin.password,
        phone,
        role,
      },
    });

    return { success: "Updated Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

export const createAdmin = async (data: AdminFormType) => {
  const { displayName, email, name, phone, role, password } = data;
  if (!password) return { error: "Password Required." };

  try {
    const existingAdminByEmail = await getAdminByIdentifier(email);
    if (existingAdminByEmail)
      return { error: "User with this Email Already Exists." };

    const existingAdminByPhone = await getAdminByIdentifier(phone);
    if (existingAdminByPhone)
      return { error: "User with this Phone Already Exists." };

    let hashedPassword = await bcrypt.hash(password, 10);

    await prisma.admin.create({
      data: {
        displayName,
        email,
        name,
        password: hashedPassword,
        phone,
        role,
      },
    });

    return { success: "Created Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

export const deleteAdmin = async (id: string) => {
  try {
    const existingAdmin = await getAdminById(id);
    if (!existingAdmin) return { error: "No Admin Found" };

    await prisma.admin.delete({
      where: { id },
    });

    return { success: "Deleted Successfully" };
  } catch (error) {
    return { error: "500: " + error };
  }
};
