import { scrollbarStyles } from "@/app/layout";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import sideBarMenuItems from "@/data/menu";
import { ChartNoAxesCombined, ChevronRight } from "lucide-react";
import Link from "next/link";
import SideBarMenu from "./SideBarMenu";

const DashboardSidebarContent = () => {
  return (
    <SidebarContent
      className={`${scrollbarStyles} ${scrollBarStyleOverwrite} pb-10 gap-0`}
    >
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {headerMenuItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton size={"lg"} asChild className="px-3">
                  <Link href={item.href}>
                    <item.icon className="scale-125 mr-2" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SideBarMenu />
    </SidebarContent>
  );
};

const headerMenuItems = [
  { label: "Dashboard", href: "/dashboard", icon: ChartNoAxesCombined },
  // { label: "Contacts", href: "/dashboard/contacts", icon: Phone },
];

export default DashboardSidebarContent;

const scrollBarStyleOverwrite = `[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-slate-200 overflow-y-auto
 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300
`;
