import React from "react";
import QaChat from "./QaChat";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/date";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: Promise<{ id: string; slug: string }>;
}

const page = async ({ params }: Props) => {
  const { slug } = await params;

  const qa = await prisma.askTutor.findUnique({
    where: { id: +slug },
    include: {
      course: true,
      user: {
        include: { image: true },
      },
      tutor: {
        include: { image: true },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        include: {
          attachment: true,
        },
      },
    },
  });

  if (!qa) return notFound();

  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      <div className="flex justify-between">
        <h3>View Q&A</h3>
        <span>{qa.course.title}</span>
      </div>

      <ul className="text-sm text-gray-500 space-y-3">
        <li className="flex justify-between ">
          <span>Created At</span>
          <span>{formatDate(qa.createdAt)}</span>
        </li>
        <Separator />
        <li className="flex justify-between text-gray-500">
          <span>Last Update</span>
          <span>{formatDate(qa.messages[0].createdAt)}</span>
        </li>
        <Separator />
      </ul>

      <QaChat qa={qa} />
    </div>
  );
};

export default page;
