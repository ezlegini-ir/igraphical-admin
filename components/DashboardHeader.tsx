import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getSessionAdmin } from "@/data/admin";
import { Home, MessageCircle, MessageSquareMore, Star } from "lucide-react";
import Link from "next/link";
import AdminUserBar from "./AdminUserBar";
import { getOnlineUsers } from "@/data/ga";

const DashboardHeader = async () => {
  const sessionUser = await getSessionAdmin();
  const onlineUsers = (await getOnlineUsers()).data;

  return (
    <div className=" flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <SidebarTrigger className="h-6 w-6" />
        <Badge variant={"blue"} className="py-3 px-4 text-sm leading-none">
          Online: {onlineUsers}
        </Badge>
      </div>

      <div className="flex items-center gap-5 lg:gap-8">
        <div>
          <Link href={"/tickets/list"} className="relative">
            <MessageCircle className="text-gray-600" size={22} />
            <div className="bg-red-500 text-white aspect-square w-4 h-4 flex justify-center items-center rounded text-xs absolute -top-[7px] -right-[7px]">
              3
            </div>
          </Link>
        </div>
        <div>
          <Link href={"/courses/reviews"} className="relative">
            <Star className="text-gray-600" size={22} />
            <div className="bg-primary text-white aspect-square w-4 h-4 flex justify-center items-center rounded text-xs absolute -top-[7px] -right-[7px]">
              1
            </div>
          </Link>
        </div>
        <div>
          <Link href={"/posts/comments"} className="relative">
            <MessageSquareMore className="text-gray-600" size={22} />
            <div className="bg-green-500 text-white aspect-square w-4 h-4 flex justify-center items-center rounded text-xs absolute -top-[7px] -right-[7px]">
              1
            </div>
          </Link>
        </div>

        <div>
          <Link href={"/tickets/list"} className="relative">
            <Home className="text-gray-600" size={22} />
          </Link>
        </div>

        <AdminUserBar user={sessionUser} />
      </div>
    </div>
  );
};

export default DashboardHeader;
