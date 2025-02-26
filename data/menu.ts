import {
  BookOpen,
  ChartBarBig,
  CreditCard,
  FilePlus,
  FileText,
  GalleryHorizontal,
  GraduationCap,
  LayoutDashboard,
  List,
  MessageCircle,
  Percent,
  Phone,
  Star,
  Tag,
  TvMinimalPlay,
  UserRoundCheck,
  Users,
} from "lucide-react";

const sideBarMenuItems = [
  {
    groupName: "Content Management",
    subMenuItems: [
      {
        tabName: "Posts",
        tabHref: "posts",
        tabIcon: BookOpen,
        subMenuItems: [
          { label: "new", href: "posts/new", icon: FilePlus },
          { label: "List", href: "posts/list", icon: List },
          { label: "Categories", href: "posts/categories", icon: Tag },
          { label: "Comments", href: "posts/comments", icon: Star },
        ],
      },
      {
        tabName: "Courses",
        tabHref: "courses",
        tabIcon: TvMinimalPlay,
        subMenuItems: [
          { label: "new", href: "courses/new", icon: FilePlus },
          { label: "List", href: "courses/list", icon: List },
          { label: "Categories", href: "courses/categories", icon: Tag },
          { label: "Reviews", href: "courses/reviews", icon: Star },
        ],
      },
      {
        tabName: "Announcements",
        tabHref: "announcements",
        tabIcon: GalleryHorizontal,
        subMenuItems: [
          { label: "Sliders", href: "announcements", icon: LayoutDashboard },
          { label: "Notif Bar", href: "announcements/new", icon: FilePlus },
        ],
      },
    ],
  },

  {
    groupName: "Financial & Data",
    subMenuItems: [
      {
        tabName: "Payments",
        tabHref: "payments",
        tabIcon: CreditCard,
        subMenuItems: [
          { label: "List", href: "payments/list", icon: List },
          { label: "New", href: "payments/new", icon: List },
        ],
      },
      {
        tabName: "Marketing",
        tabHref: "marketing",
        tabIcon: Percent,
        subMenuItems: [
          { label: "Discount Codes", href: "invoices/list", icon: List },
          { label: "Overall Off", href: "invoices/list", icon: List },
        ],
      },
      {
        tabName: "Statistics",
        tabHref: "statistics",
        tabIcon: ChartBarBig,
        subMenuItems: [
          { label: "Overview", href: "statistics", icon: LayoutDashboard },
          { label: "Reports", href: "statistics/reports", icon: FileText },
        ],
      },
      // {
      //   tabName: "Exports",
      // tabHref: "exports",
      //   tabIcon: FolderInput,
      //   subMenuItems: [
      //     { label: "Dashboard", href: "exports", icon: LayoutDashboard },
      //     { label: "Data Export", href: "exports/data", icon: FileText },
      //     { label: "Reports Export", href: "exports/reports", icon: FileText },
      //   ],
      // },
    ],
  },

  {
    groupName: "Support & Communication",
    subMenuItems: [
      {
        tabName: "Tickets",
        tabHref: "tickets",
        tabIcon: MessageCircle,
        subMenuItems: [{ label: "New", href: "tickets/new", icon: List }],
      },
      {
        tabName: "Contacts",
        tabHref: "contacts",
        tabIcon: Phone,
        subMenuItems: [{ label: "List", href: "contacts/list", icon: List }],
      },
      // {
      //   tabName: "SMS",
      // tabHref: "sms",
      //   tabIcon: Mail,
      //   subMenuItems: [
      //     { label: "Send SMS", href: "help-desk/tickets", icon: List },
      //   ],
      // },
      // {
      //   tabName: "EMAIL",
      // tabHref: "email",
      //   tabIcon: AtSign,
      //   subMenuItems: [
      //     { label: "Inbox", href: "contacts/list", icon: List },
      //     { label: "Send Email", href: "contacts/list", icon: List },
      //   ],
      // },
    ],
  },

  {
    groupName: "User Management",
    subMenuItems: [
      {
        tabName: "Students",
        tabHref: "students",
        tabIcon: Users,
        subMenuItems: [
          { label: "List", href: "students/list", icon: List },
          { label: "new", href: "students/new", icon: List },
        ],
      },
      {
        tabName: "Tutors",
        tabHref: "tutors",
        tabIcon: GraduationCap,
        subMenuItems: [{ label: "List", href: "tutors/list", icon: List }],
      },
      {
        tabName: "Admins",
        tabHref: "admins",
        tabIcon: UserRoundCheck,
        subMenuItems: [
          // { label: "New", href: "admins/list", icon: List },
          // { label: "List", href: "admins/list", icon: List },
        ],
      },
    ],
  },
];

export default sideBarMenuItems;
