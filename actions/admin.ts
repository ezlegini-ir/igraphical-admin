"use server";

import { getAdminById, getAdminByIdentifier } from "@/data/admin";
import { AdminFormType } from "@/lib/validationSchema";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";
import { UploadApiResponse } from "cloudinary";
import { deleteCloudImage, uploadImage } from "./cloudinary";

//* CREATE ------------------------------------------------------------

export const createAdmin = async (data: AdminFormType) => {
  const { displayName, email, name, phone, role, password, image } = data;
  if (!password) return { error: "Password Required." };

  try {
    const existingAdminByEmail = await getAdminByIdentifier(email);
    if (existingAdminByEmail)
      return { error: "User with this Email Already Exists." };

    const existingAdminByPhone = await getAdminByIdentifier(phone);
    if (existingAdminByPhone)
      return { error: "User with this Phone Already Exists." };

    let hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        displayName,
        email,
        name,
        password: hashedPassword,
        phone,
        role,
      },
    });

    if (image && image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());

      const { secure_url, public_id, format, bytes } = (await uploadImage(
        buffer,
        {
          folder: "admin",
          width: 300,
        }
      )) as UploadApiResponse;

      // CREATE IMAGE
      await prisma.image.create({
        data: {
          url: secure_url,
          public_id,
          format,
          size: bytes,
          admin: {
            connect: {
              id: newAdmin.id,
            },
          },
        },
      });
    }

    return { success: "Admin Created Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//* UPDATE ------------------------------------------------------------

export const updateAdmin = async (data: AdminFormType & { id: string }) => {
  const { displayName, email, id, name, phone, role, password, image } = data;

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

    const updatedAdmin = await prisma.admin.update({
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
      include: {
        image: true,
      },
    });

    if (image && image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const { secure_url, public_id, format, bytes } = (await uploadImage(
        buffer,
        {
          folder: "admin",
          width: 300,
        }
      )) as UploadApiResponse;

      if (updatedAdmin.image) {
        await deleteCloudImage(updatedAdmin.image.public_id);

        // CREATE IMAGE
        await prisma.image.update({
          where: {
            adminId: updatedAdmin.id,
          },
          data: {
            url: secure_url,
            public_id,
            format,
            size: bytes,
          },
        });
      } else {
        // CREATE IMAGE
        await prisma.image.create({
          data: {
            url: secure_url,
            public_id,
            format,
            size: bytes,
            admin: {
              connect: {
                id: updatedAdmin.id,
              },
            },
          },
        });
      }
    }

    return { success: "Updated Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//* DELETE ------------------------------------------------------------

export const deleteAdmin = async (id: string) => {
  try {
    const existingAdmin = await getAdminById(id);
    if (!existingAdmin) return { error: "No Admin Found" };

    const deletedAdmin = await prisma.admin.delete({
      where: { id },
      include: { image: true },
    });

    if (!deletedAdmin) return { error: "Could not remove admin" };

    if (deletedAdmin.image)
      await deleteCloudImage(deletedAdmin.image?.public_id);

    return { success: "Deleted Successfully" };
  } catch (error) {
    return { error: "500: " + error };
  }
};
