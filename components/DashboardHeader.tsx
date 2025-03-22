import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getSessionAdmin } from "@/data/admin";
import { getOnlineUsers } from "@/data/ga";
import prisma from "@/prisma/client";
import { Home, MessageCircle } from "lucide-react";
import Link from "next/link";
import AdminUserBar from "./AdminUserBar";

const DashboardHeader = async () => {
  const sessionUser = await getSessionAdmin();
  const onlineUsers = (await getOnlineUsers()).data;

  const pendingTicketsCount = await prisma.ticket.count({
    where: { status: "PENDING" },
  });

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <SidebarTrigger className="h-6 w-6" />
        <Badge variant={"blue"} className="py-3 px-4 text-sm leading-none">
          Online: {onlineUsers}
        </Badge>
      </div>

      <div className="flex items-center gap-5 lg:gap-6 text-gray-500/75">
        <div>
          <Link href={"/tickets/list?status=PENDING"} className="relative">
            <MessageCircle size={22} />
            {pendingTicketsCount > 0 && (
              <Badge
                variant={"red"}
                className="p-0 w-4 h-4 absolute -top-[7px] -right-[7px]"
              >
                {pendingTicketsCount}
              </Badge>
            )}
          </Link>
        </div>

        {/* <div>
          <Link href={"/courses/reviews"} className="relative">
            <Star size={22} />
            <Badge
              variant={"blue"}
              className="p-0 w-4 h-4 absolute -top-[7px] -right-[7px]"
            >
              1
            </Badge>
          </Link>
        </div>

        <div>
          <Link href={"/posts/comments"} className="relative">
            <MessageSquareMore size={22} />
            <Badge
              variant={"green"}
              className="p-0 w-4 h-4 absolute -top-[7px] -right-[7px]"
            >
              1
            </Badge>
          </Link>
        </div> */}

        <div>
          <Link
            target="_blank"
            href={`${process.env.NEXT_PUBLIC_MAIN_URL}`}
            className="relative"
          >
            <Home size={22} />
          </Link>
        </div>

        <AdminUserBar user={sessionUser} />
      </div>
    </div>
  );
};

export default DashboardHeader;
