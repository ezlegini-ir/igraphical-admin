"use server";

import { getUserById } from "@/data/user";
import { studentFormSchema, StudentFormType } from "@/lib/validationSchema";
import { prisma } from "@igraphical/core";
import { UploadApiResponse } from "cloudinary";
import { deleteCloudFile, uploadCloudFile } from "./cloudinary";

//* CREATE ------------------------------------------------------------

export async function createUser(data: StudentFormType) {
  const { email, firstName, lastName, nationalId, phone, image } = data;

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
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        firstName,
        lastName,
        nationalId: nationalId || "0000000000",
        phone,
        fullName: `${firstName} ${lastName}`,
      },
    });

    if (image && image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());

      const { secure_url, public_id, format, bytes } = (await uploadCloudFile(
        buffer,
        {
          folder: "user",
        }
      )) as UploadApiResponse;

      // CREATE IMAGE
      await prisma.image.create({
        data: {
          url: secure_url,
          public_id,
          format,
          size: bytes,
          type: "USER",
          user: {
            connect: {
              id: newUser.id,
            },
          },
        },
      });
    }

    return { success: "User Created Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
}

//? UPDATE ------------------------------------------------------------

export const updateUser = async (data: StudentFormType, id: number) => {
  const { email, firstName, lastName, phone, nationalId, image } = data;

  try {
    const existingStudent = await getUserById(id);
    if (!existingStudent) return { error: "No Admin Found" };

    if (id !== existingStudent.id) {
      if (existingStudent && existingStudent.email === email)
        return { error: "User with this Email Already Exists." };

      if (existingStudent && existingStudent.phone === phone)
        return { error: "User with this Phone Already Exists." };
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        nationalId,
        id,
        email,
        phone,
      },
      include: { image: true },
    });

    if (image && image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const { secure_url, public_id, format, bytes } = (await uploadCloudFile(
        buffer,
        {
          folder: "user",
          width: 300,
        }
      )) as UploadApiResponse;

      if (updatedUser.image) await deleteCloudFile(updatedUser.image.public_id);

      await prisma.image.upsert({
        where: { id: updatedUser.id },
        update: {
          url: secure_url,
          type: "USER",
          public_id,
          format,
          size: bytes,
        },
        create: {
          url: secure_url,
          public_id,
          format,
          type: "USER",
          size: bytes,
          user: {
            connect: {
              id: updatedUser.id,
            },
          },
        },
      });
    }

    return { success: "Updated Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//! DELETE ------------------------------------------------------------

export const deleteUser = async (id: number) => {
  try {
    const existingAdmin = await getUserById(id);
    if (!existingAdmin) return { error: "No Admin Found" };

    const deletedUser = await prisma.user.delete({
      where: { id },
      include: { image: true },
    });

    if (!deletedUser) return { error: "Could not remove admin" };

    if (deletedUser.image) await deleteCloudFile(deletedUser.image?.public_id);

    return { success: "Deleted Successfully" };
  } catch (error) {
    return { error: "500: " + error };
  }
};
