import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getSessionAdmin } from "@/data/admin";
import AdminUserBar from "./AdminUserBar";

const DashboardHeader = async () => {
  const sessionUser = await getSessionAdmin();

  return (
    <div className=" flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <SidebarTrigger className="h-6 w-6" />
        <Badge variant={"blue"} className="py-3 px-4 text-sm leading-none">
          Online: 16
        </Badge>
      </div>
      <AdminUserBar user={sessionUser} />
    </div>
  );
};

export default DashboardHeader;
