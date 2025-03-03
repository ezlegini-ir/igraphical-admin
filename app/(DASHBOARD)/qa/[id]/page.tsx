import { coursePic } from "@/public";
import { QaType } from "../QaList";
import QaChat from "./QaChat";

interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      <div className="flex justify-between">
        <h3>View Q&A</h3>
        <span>{qa.course.title}</span>
      </div>

      <QaChat qa={qa} />
    </div>
  );
};

const qa: QaType = {
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
      message:
        "با سلام و وق تبخیر، نمیدونم به دوره دسترسی داشت هباشم کمک کن عزیزوم",
      qaId: 1,
      type: "STUDENT",
      user: { id: 1, name: "علیرضا ازلگینی" },
    },
  ],
};

export default page;
