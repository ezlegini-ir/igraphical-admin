"use server";

import { getPostById, getPostByUrl } from "@/data/post";
import { PostFormType } from "@/lib/validationSchema";
import prisma from "@/prisma/client";
import { UploadApiResponse } from "cloudinary";
import { deleteCloudImage, uploadCloudImage } from "./cloudinary";
import { encodeUrl } from "@/lib/utils";

//* CREATE ------------------------------------------------------------

export const createPost = async (data: PostFormType) => {
  const { author, categories, content, image, status, title, url } = data;

  try {
    const encodedUrl = encodeUrl(url);

    const existingPost = await getPostByUrl(encodedUrl);

    if (existingPost) return { error: "There Already is a post with this Url" };

    const newPost = await prisma.post.create({
      data: {
        content,
        status: status === "0" ? "DRAFT" : "PUBLISHED",
        title,
        url: encodedUrl,
        categories: {
          connect: categories.map((categoryId) => ({ id: +categoryId })),
        },
        author: {
          connect: {
            id: +author,
          },
        },
      },
    });

    if (image && image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());

      const { secure_url, public_id, format, bytes } = (await uploadCloudImage(
        buffer,
        {
          folder: "post",
          width: 800,
        }
      )) as UploadApiResponse;

      // CREATE IMAGE
      await prisma.image.create({
        data: {
          url: secure_url,
          public_id,
          format,
          type: "POST",
          size: bytes,
          post: {
            connect: {
              id: newPost.id,
            },
          },
        },
      });
    }

    return { success: "Admin Created Successfully", data: newPost };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//? UPDATE ------------------------------------------------------------

export const updatePost = async (data: PostFormType, id: number) => {
  const { author, categories, content, image, status, title, url } = data;

  try {
    const encodedUrl = url.split(" ").join("-");

    const existingPostById = await getPostById(id);
    if (!existingPostById) return { error: "No Post Found" };

    const existingPostByUrl = await getPostByUrl(encodedUrl);
    if (existingPostByUrl) {
      if (existingPostByUrl.id !== existingPostById.id) {
        return { error: "Post with this URL already exists." };
      }
    }

    const updatedPost = await prisma.post.update({
      where: {
        id,
      },
      data: {
        content,
        status: status === "0" ? "DRAFT" : "PUBLISHED",
        title,
        url: encodedUrl,
        categories: {
          connect: categories.map((categoryId) => ({ id: +categoryId })),
        },
        author: {
          connect: {
            id: +author,
          },
        },
      },
      include: { image: true },
    });

    if (image && image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const { secure_url, public_id, format, bytes } = (await uploadCloudImage(
        buffer,
        {
          folder: "post",
          width: 800,
        }
      )) as UploadApiResponse;

      if (updatedPost.image) {
        await deleteCloudImage(updatedPost.image.public_id);
      }

      await prisma.image.upsert({
        where: { postId: updatedPost.id },
        update: {
          url: secure_url,
          public_id,
          format,
          size: bytes,
        },
        create: {
          url: secure_url,
          public_id,
          type: "POST",
          format,
          size: bytes,
          post: {
            connect: { id: updatedPost.id },
          },
        },
      });
    }

    return { success: "Updated Successfully", data: updatedPost };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//! DELETE ------------------------------------------------------------

export const deletePost = async (id: number) => {
  try {
    const existingPost = await getPostById(id);
    if (!existingPost) return { error: "No Post Found" };

    const deletedPost = await prisma.post.delete({
      where: { id },
      include: { image: true },
    });

    if (!deletedPost) return { error: "Could not remove Post" };

    if (deletedPost.image) await deleteCloudImage(deletedPost.image?.public_id);

    return { success: "Deleted Successfully" };
  } catch (error) {
    return { error: "500: " + error };
  }
};
