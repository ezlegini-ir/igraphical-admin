import { Button } from "@/components/ui/button";
import { avatar, profile } from "@/public";
import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QaType } from "../QaList";

interface Props {
  qa: QaType;
}

const QaChat = ({ qa }: Props) => {
  return (
    <div className="py-3 space-y-3" dir="rtl">
      {qa?.qa.map((qa, index) => (
        <div key={index} className="space-y-3 text-sm">
          <div
            className={`card flex justify-between gap-5 items-end py-2 ${
              qa.type === "STUDENT" && "bg-slate-100"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <Image
                  alt=""
                  src={qa.type === "TUTOR" ? profile : avatar}
                  width={40}
                  height={40}
                />
                <div>
                  <p>{qa.user.name}</p>
                  <span className="text-xs text-gray-500">
                    {qa.createdAt.toLocaleString("en-US")}
                  </span>
                </div>
              </div>
              <p>{qa.message}</p>
            </div>

            {qa.attachment && (
              <div>
                <Link href={qa.attachment.fileUrl}>
                  <Button size={"icon"} className="h-8 w-8" type="button">
                    <Download />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QaChat;
