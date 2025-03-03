"use server";

import { getAdminById, getAdminByIdentifier } from "@/data/admin";
import { getTutorById, getTutorByIdentifier } from "@/data/tutor";
import { TutorFormType } from "@/lib/validationSchema";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";

export const updateTutor = async (data: TutorFormType & { id: string }) => {
  const { displayName, email, id, name, phone, password } = data;

  try {
    const existingTutor = await getTutorById(id);
    if (!existingTutor) return { error: "No Tutor Found" };

    if (id !== existingTutor.id) {
      if (existingTutor && existingTutor.email === email)
        return { error: "Tutor with this Email Already Exists." };

      if (existingTutor && existingTutor.phone === phone)
        return { error: "Tutor with this Phone Already Exists." };
    }

    let hashedPassword;
    if (password) hashedPassword = await bcrypt.hash(password, 10);

    await prisma.tutor.update({
      where: {
        id: existingTutor.id,
      },
      data: {
        id,
        displayName,
        email,
        name,
        password: password ? hashedPassword : existingTutor.password,
        phone,
      },
    });

    return { success: "Updated Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

export const createTutor = async (data: TutorFormType) => {
  const { displayName, email, name, phone, password } = data;
  if (!password) return { error: "Password Required." };

  try {
    const existingAdminByEmail = await getTutorByIdentifier(email);
    if (existingAdminByEmail)
      return { error: "Tutor with this Email Already Exists." };

    const existingAdminByPhone = await getTutorByIdentifier(phone);
    if (existingAdminByPhone)
      return { error: "Tutor with this Phone Already Exists." };

    let hashedPassword = await bcrypt.hash(password, 10);

    await prisma.tutor.create({
      data: {
        displayName,
        email,
        name,
        password: hashedPassword,
        phone,
      },
    });

    return { success: "Created Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

export const deleteTutor = async (id: string) => {
  try {
    const existingAdmin = await getTutorById(id);
    if (!existingAdmin) return { error: "No Tutor Found" };

    await prisma.tutor.delete({
      where: { id },
    });

    return { success: "Deleted Successfully" };
  } catch (error) {
    return { error: "500: " + error };
  }
};
