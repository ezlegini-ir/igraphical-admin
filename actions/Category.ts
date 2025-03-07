"use server";

import { getPostCategoryById, getPostCategoryByUrl } from "@/data/post";
import { encodeUrl } from "@/lib/utils";
import { CategoryFormType } from "@/lib/validationSchema";
import prisma from "@/prisma/client";

export type CategoryName = "POST" | "COURSE";

//* CREATE ------------------------------------------------------------

export const createCategory = async (
  data: CategoryFormType,
  categoryName: CategoryName
) => {
  const { name, url } = data;

  try {
    const encodedUrl = encodeUrl(url);

    // todo
    const existingCategory =
      categoryName === "POST"
        ? await getPostCategoryByUrl(encodedUrl)
        : await getPostCategoryByUrl(encodedUrl);

    if (existingCategory)
      return { error: "There Already is a category with this Url" };

    if (categoryName === "POST") {
      await prisma.postCategory.create({
        data: { name, url: encodedUrl },
      });
    } else {
      // todo
      await prisma.postCategory.create({
        data: { name, url: encodedUrl },
      });
    }

    return { success: "Category Created Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//? UPDATE ------------------------------------------------------------

export const updateCategory = async (
  data: CategoryFormType,
  id: number,
  name: CategoryName
) => {
  const { name: title, url } = data;
  const encodedUrl = encodeUrl(url);

  try {
    const existingCategoryById =
      name === "POST"
        ? await getPostCategoryById(id)
        : await getPostCategoryById(id);
    if (!existingCategoryById) return { error: "No Category Found" };

    // todo
    const existingCategoryByUrl =
      name === "POST"
        ? await getPostCategoryByUrl(encodedUrl)
        : await getPostCategoryByUrl(encodedUrl);

    if (existingCategoryByUrl) {
      if (existingCategoryByUrl.id !== existingCategoryById.id) {
        return { error: "Category with this URL already exists." };
      }
    }

    if (name === "POST") {
      await prisma.postCategory.update({
        where: { id: existingCategoryById.id },
        data: { name: title, url: encodedUrl },
      });
    } else {
      // todo
      await prisma.postCategory.update({
        where: { id: existingCategoryById.id },
        data: { name: title, url: encodedUrl },
      });
    }

    return { success: "Category Updated Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

export const deleteCategory = async (
  id: number,
  categoryName: CategoryName
) => {
  try {
    //todo
    const existingCategory =
      categoryName === "POST"
        ? await getPostCategoryById(id)
        : await getPostCategoryById(id);

    if (!existingCategory) return { error: "No Category Found" };

    if (categoryName === "POST") {
      await prisma.postCategory.delete({
        where: { id },
      });
    } else {
      //todo
      await prisma.postCategory.delete({
        where: { id },
      });
    }

    return { success: "Category Deleted" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};
