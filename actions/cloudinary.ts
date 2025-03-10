"use server";

import { v2 as cloudinary } from "cloudinary";

export interface UploadOptions {
  folder?: "admin" | "tutor" | "user" | "course" | "post" | "asset" | "slider";
  width?: number;
  public_id?: string;
}

// Cloudinary upload function
export const uploadCloudImage = async (
  buffer: Buffer,
  options?: UploadOptions
) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: options?.folder ? `/images/${options?.folder}` : "/images",
          format: "webp",
          transformation: [{ width: options?.width || 500, crop: "limit" }],
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

export const uploadManyCloudImages = async (
  buffers: Buffer[],
  options?: UploadOptions
) => {
  const uploadPromises = buffers.map((image) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: options?.folder ? `/images/${options.folder}` : "/images",
            format: "webp",
            transformation: [{ width: options?.width || 500, crop: "limit" }],
            public_id: options?.public_id,
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        )
        .end(image);
    });
  });
  return Promise.all(uploadPromises);
};

export const deleteCloudImage = async (public_id: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

export const deleteManyCloudImages = async (
  public_ids: string[]
): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(public_ids, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
