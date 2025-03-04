import { signOut } from "@/auth";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { profile } from "@/public";
import { Admin } from "@prisma/client";
import {
  ChartNoAxesCombined,
  FilePlus2,
  GalleryHorizontal,
  LogOut,
  MessageCircle,
  Percent,
  Plus,
  User as UserIcon,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

interface Props {
  user: Admin | null;
}

const UserBar = ({ user }: Props) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="cursor-pointer drop-shadow-lg">
          <Avatar src={profile} size={40} />
        </div>
      </PopoverTrigger>

      <PopoverContent className="mr-3" dir="ltr">
        <div className="space-y-6">
          <div className="bg-slate-100 p-3 px-2 rounded-sm border-dashed border-slate-400/60 border-[1px] flex gap-2 items-center">
            <Avatar src={profile} size={37} />
            <div className="flex flex-col">
              <span>{user?.name}</span>
              <span className="text-xs text-primary font-semibold">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            {menuItems.map((item, index) => (
              <Link key={index} href={`/${item.href}`}>
                <Button className="w-full justify-start" variant={"ghost"}>
                  <item.icon />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          <div className="space-y-3">
            <Separator />

            <Button className="w-full justify-start" variant={"ghost"}>
              <UserIcon />
              <span>My Profile</span>
            </Button>
            <Separator />
          </div>

          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button variant={"lightRed"} className="w-full text-left">
              <LogOut />
              Sign Out
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const menuItems = [
  { label: "Dashboard", href: "", icon: ChartNoAxesCombined },
  { label: "Announcements", href: "announcements", icon: GalleryHorizontal },
  { label: "Tickets", href: "tickets", icon: MessageCircle },
  { label: "Overall Off", href: "panel/profile", icon: Percent },
  { label: "New Post", href: "posts/new", icon: FilePlus2 },
  { label: "New Student", href: "students/new", icon: UserPlus },
  { label: "New Course", href: "courses/new", icon: Plus },
];

export default UserBar;
