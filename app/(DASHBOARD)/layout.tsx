import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardHeader from "../../components/DashboardHeader";
import DashboardSidebar from "../../components/sidebar/Dashboard-Sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="en-digits">
      <SidebarProvider>
        <DashboardSidebar />

        <SidebarInset className="bg-[#fafafa]">
          <main className="w-full  mx-auto p-3 lg:px-12 lg:p-4 space-y-4 ">
            <DashboardHeader />
            <div>{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
