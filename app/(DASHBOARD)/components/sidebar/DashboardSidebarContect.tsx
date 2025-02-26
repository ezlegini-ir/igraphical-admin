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
import dashboardSideBarMenuItems from "@/data/menu";
import { ChartNoAxesCombined, ChevronRight } from "lucide-react";
import Link from "next/link";

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

      {dashboardSideBarMenuItems.map((group, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel>{group.groupName}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.subMenuItems.map((tab, index) => (
                <Collapsible
                  key={index}
                  className="group/collapsible text-gray-500"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="text-base py-5">
                        <div className="flex justify-between items-center w-full ">
                          <span className="flex items-center gap-2.5">
                            <tab.tabIcon
                              className="text-primary"
                              size={17}
                              strokeWidth={2.5}
                            />
                            {tab.tabName}
                          </span>
                          <span>
                            {tab.subMenuItems.length > 0 && (
                              <ChevronRight size={14} />
                            )}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="text-sm font-medium py-2">
                        {tab.subMenuItems.map((sub, index) => (
                          <Link
                            href={`/${sub.href}`}
                            key={index}
                            className="px-3 py-1.5 hover:bg-slate-100 rounded-sm"
                          >
                            <SidebarMenuSubItem>{sub.label}</SidebarMenuSubItem>
                          </Link>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
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
