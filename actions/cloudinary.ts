"use server";

import { v2 as cloudinary } from "cloudinary";

interface UploadOptions {
  folder?: string;
  width?: number;
  public_id?: string;
}

// Cloudinary upload function
export const uploadImage = async (buffer: Buffer, options?: UploadOptions) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: options?.folder ? `/images/${options?.folder}` : "/images",
          format: "webp",
          transformation: options?.width
            ? [{ width: options.width, crop: "limit" }]
            : [{ width: 500, crop: "limit" }],
          public_id: options?.public_id,
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
};

export const deleteCloudImage = async (public_id: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};
