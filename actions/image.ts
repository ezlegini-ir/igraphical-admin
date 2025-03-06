"use server";

import prisma from "@/prisma/client";
import { UploadApiResponse } from "cloudinary";
import {
  deleteImage as deleteCloudImage,
  uploadImage,
  UploadOptions,
} from "./cloudinary";

//* CREATE ------------------------------------------------------------

export const createPostContentImage = async (
  file: File,
  options?: UploadOptions
) => {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const { secure_url, public_id, format, bytes } = (await uploadImage(
      buffer,
      options
    )) as UploadApiResponse;

    await prisma.image.create({
      data: {
        format,
        public_id,
        size: bytes,
        url: secure_url,
        type: "DOCUMENT",
      },
    });

    return { url: secure_url };
  } catch (error) {
    return { error: "Error: " + error };
  }
};

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
