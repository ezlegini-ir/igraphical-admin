"use server";

import prisma from "@/prisma/client";
import { deleteImage as deleteCloudImage } from "./cloudinary";

//! DELETE ------------------------------------------------------------

export const deleteImage = async (public_id: string) => {
  try {
    const deletedImage = await prisma.image.delete({
      where: { public_id },
    });

    if (!deletedImage) return { error: "Could Not Delete Image" };

    const res = (await deleteCloudImage(deletedImage.public_id)) as {
      result: "ok";
    };

    if (res.result !== "ok") return { error: "Could Not Delete Image" };

    return { success: "Image Deleted" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};
