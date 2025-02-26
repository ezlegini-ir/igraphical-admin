import React from "react";
import PostsList from "./PostsList";
import { coursePic } from "@/public";
import { sort } from "fast-sort";
interface Props {
  searchParams: Promise<{ page: string; filer: string; search: string }>;
}

const totalPosts = 15;

const page = async ({ searchParams }: Props) => {
  const { page, filer, search } = await searchParams;

  return <PostsList posts={posts} totalPosts={totalPosts} />;
};

export default page;

const posts = [
  {
    id: 1,
    title: "چطور در ادوبی ایلوستریتور سواچ های  پنتون را برگردانیم؟",
    image: { url: coursePic },
    author: { name: "Alireza Ezlegini" },
    category: [{ name: "بسته بندی" }],
    views: 1243451,
    publishedAt: new Date(),
  },
  {
    id: 2,
    title: "چطور در ادوبی ایلوستریتور سواچ های  پنتون را برگردانیم؟",
    image: { url: coursePic },
    author: { name: "Alireza Ezlegini" },
    category: [{ name: "بسته بندی" }],
    views: 1663451,
    publishedAt: new Date(),
  },
  {
    id: 3,
    title: "چطور در ادوبی ایلوستریتور سواچ های  پنتون را برگردانیم؟",
    image: { url: coursePic },
    author: { name: "Alireza Ezlegini" },
    category: [{ name: "بسته بندی" }],
    views: 123451,
    publishedAt: new Date(),
  },
  {
    id: 4,
    title: "چطور در ادوبی ایلوستریتور سواچ های  پنتون را برگردانیم؟",
    image: { url: coursePic },
    author: { name: "Alireza Ezlegini" },
    category: [{ name: "بسته بندی" }],
    views: 123451,
    publishedAt: new Date(),
  },
  {
    id: 5,
    title: "چطور در ادوبی ایلوستریتور سواچ های  پنتون را برگردانیم؟",
    image: { url: coursePic },
    author: { name: "Alireza Ezlegini" },
    category: [{ name: "بسته بندی" }],
    views: 123451,
    publishedAt: new Date(),
  },
  {
    id: 6,
    title: "چطور در ادوبی ایلوستریتور سواچ های  پنتون را برگردانیم؟",
    image: { url: coursePic },
    author: { name: "Alireza Ezlegini" },
    category: [{ name: "بسته بندی" }],
    views: 123451,
    publishedAt: new Date(),
  },
  {
    id: 7,
    title: "چطور در ادوبی ایلوستریتور سواچ های  پنتون را برگردانیم؟",
    image: { url: coursePic },
    author: { name: "Alireza Ezlegini" },
    category: [{ name: "بسته بندی" }],
    views: 123451,
    publishedAt: new Date(),
  },
  {
    id: 8,
    title: "چطور در ادوبی ایلوستریتور سواچ های  پنتون را برگردانیم؟",
    image: { url: coursePic },
    author: { name: "Alireza Ezlegini" },
    category: [{ name: "بسته بندی" }],
    views: 123451,
    publishedAt: new Date(),
  },
  {
    id: 9,
    title: "چطور در ادوبی ایلوستریتور سواچ های  پنتون را برگردانیم؟",
    image: { url: coursePic },
    author: { name: "Alireza Ezlegini" },
    category: [{ name: "بسته بندی" }],
    views: 123451,
    publishedAt: new Date(),
  },
  {
    id: 10,
    title: "چطور در ادوبی ایلوستریتور سواچ های  پنتون را برگردانیم؟",
    image: { url: coursePic },
    author: { name: "Alireza Ezlegini" },
    category: [{ name: "بسته بندی" }],
    views: 123451,
    publishedAt: new Date(),
  },
  {
    id: 11,
    title: "چطور در ادوبی ایلوستریتور سواچ های  پنتون را برگردانیم؟",
    image: { url: coursePic },
    author: { name: "Alireza Ezlegini" },
    category: [{ name: "بسته بندی" }],
    views: 123451,
    publishedAt: new Date(),
  },
  {
    id: 12,
    title: "چطور در ادوبی ایلوستریتور سواچ های  پنتون را برگردانیم؟",
    image: { url: coursePic },
    author: { name: "Alireza Ezlegini" },
    category: [{ name: "بسته بندی" }],
    views: 123451,
    publishedAt: new Date(),
  },
  {
    id: 13,
    title: "چطور در ادوبی ایلوستریتور سواچ های  پنتون را برگردانیم؟",
    image: { url: coursePic },
    author: { name: "Alireza Ezlegini" },
    category: [{ name: "بسته بندی" }],
    views: 123451,
    publishedAt: new Date(),
  },
  {
    id: 14,
    title: "چطور در ادوبی ایلوستریتور سواچ های  پنتون را برگردانیم؟",
    image: { url: coursePic },
    author: { name: "Alireza Ezlegini" },
    category: [{ name: "بسته بندی" }],
    views: 123451,
    publishedAt: new Date(),
  },
  {
    id: 15,
    title: "چطور در ادوبی ایلوستریتور سواچ های  پنتون را برگردانیم؟",
    image: { url: coursePic },
    author: { name: "Alireza Ezlegini" },
    category: [{ name: "بسته بندی" }],
    views: 123451,
    publishedAt: new Date(),
  },
];
