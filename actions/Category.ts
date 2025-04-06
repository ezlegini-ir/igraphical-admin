"use server";

import {
  getCourseCategoryById,
  getCourseCategoryByUrl,
  getPostCategoryById,
  getPostCategoryByUrl,
} from "@/data/category";
import { encodeUrl as encodeSlug } from "@/lib/utils";
import { CategoryFormType } from "@/lib/validationSchema";
import { prisma } from "@igraphical/core";

export type CategoryFor = "POST" | "COURSE";

//* CREATE ------------------------------------------------------------

export const createCategory = async (
  data: CategoryFormType,
  categoryFor: CategoryFor
) => {
  const { name, url } = data;

  try {
    const encodedUrl = encodeSlug(url || name);

    const existingCategory =
      categoryFor === "POST"
        ? await getPostCategoryByUrl(encodedUrl)
        : await getCourseCategoryByUrl(encodedUrl);

    if (existingCategory)
      return { error: "There Already is a category with this Url" };

    if (categoryFor === "POST") {
      await prisma.postCategory.create({
        data: { name, url: encodedUrl },
      });
    } else {
      await prisma.courseCategory.create({
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
  categoryFor: CategoryFor
) => {
  const { name: title, url } = data;
  const encodedUrl = encodeSlug(url || title);

  try {
    const existingCategoryById =
      categoryFor === "POST"
        ? await getPostCategoryById(id)
        : await getCourseCategoryById(id);
    if (!existingCategoryById) return { error: "No Category Found" };

    const existingCategoryByUrl =
      categoryFor === "POST"
        ? await getPostCategoryByUrl(encodedUrl)
        : await getCourseCategoryByUrl(encodedUrl);

    if (
      existingCategoryByUrl &&
      existingCategoryByUrl.id !== existingCategoryById.id
    ) {
      return { error: "Category with this URL already exists." };
    }

    if (categoryFor === "POST") {
      await prisma.postCategory.update({
        where: { id: existingCategoryById.id },
        data: { name: title, url: encodedUrl },
      });
    } else {
      await prisma.courseCategory.update({
        where: { id: existingCategoryById.id },
        data: { name: title, url: encodedUrl },
      });
    }

    return { success: "Category Updated Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//! DELETE ------------------------------------------------------------

export const deleteCategory = async (id: number, categoryFor: CategoryFor) => {
  try {
    const existingCategory =
      categoryFor === "POST"
        ? await getPostCategoryById(id)
        : await getCourseCategoryById(id);

    if (!existingCategory) return { error: "No Category Found" };

    if (categoryFor === "POST") {
      await prisma.postCategory.delete({
        where: { id },
      });
    } else {
      await prisma.courseCategory.delete({
        where: { id },
      });
    }

    return { success: "Category Deleted" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};
