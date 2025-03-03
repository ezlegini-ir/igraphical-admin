import React from "react";
import QaList, { QaType } from "./QaList";
import { coursePic } from "@/public";
import Filter from "@/components/Filter";
import Search from "@/components/Search";

const totalQa = 15;

const page = () => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>Questions and Answers</h3>
        <div className="flex gap-3 justify-between items-center">
          <Search />

          <Filter
            defaultValue="all"
            placeholder="All Q&A"
            name="course"
            options={[
              { label: "All Courses", value: "all" },
              {
                label: "دوره جامع نرم افزار ادوبی ایلوستریتور",
                value: "1",
              },
              {
                label: "دوره جامع نرم افزار ادوبی ایندیزاین",
                value: "2",
              },
              {
                label: "دوره جامع نرم افزار ادوبی فتوشاپ",
                value: "3",
              },
            ]}
          />

          <Filter
            defaultValue="all"
            placeholder="All Q&A"
            name="tutor"
            options={[
              { label: "All Tutors", value: "all" },
              {
                label: "علیرضا ازلگینی",
                value: "1",
              },
            ]}
          />
        </div>
      </div>

      <QaList qa={qa} totalQa={totalQa} />
    </div>
  );
};

export default page;

const qa: QaType[] = [
  {
    course: {
      id: 1,
      image: { url: coursePic },
      title: "دوره جامع نرم افزار ادوبی ایلوستریتور",
    },
    createdAt: new Date(),
    id: 1,
    status: "ANSWERED",
    tutor: {
      email: "elztgin@mgailc.om",
      id: 1,
      name: "علیرذضا ازلگینی",
      phone: "091274652869",
    },

    updatedAt: new Date(),
    user: {
      email: "ezlegini.ir@gmail.com",
      id: 1,
      name: "فاطمه احمدی",
      phone: "09127452859",
    },

    qa: [
      {
        createdAt: new Date(),
        id: 1,
        message: "سلام",
        qaId: 1,
        type: "TUTOR",
        user: { id: 1, name: "علیرضا ازلگینی" },
        attachment: { fileUrl: "url", id: 1 },
      },
      {
        createdAt: new Date(),
        id: 1,
        message: "سلام",
        qaId: 1,
        type: "STUDENT",
        user: { id: 1, name: "علیرضا ازلگینی" },
        attachment: { fileUrl: "url", id: 1 },
      },
    ],
  },
];
