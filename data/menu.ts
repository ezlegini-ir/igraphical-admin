import {
  AtSign,
  BookOpen,
  ChartBarBig,
  CreditCard,
  FilePlus,
  FileText,
  FolderInput,
  GalleryHorizontal,
  GraduationCap,
  LayoutDashboard,
  List,
  Mail,
  MessageCircle,
  Percent,
  Phone,
  Star,
  Tag,
  TvMinimalPlay,
  UserPlus,
  UserRoundCheck,
  Users,
} from "lucide-react";

const sideBarMenuItems = [
  {
    groupName: "Content Management",
    subMenuItems: [
      {
        tabName: "Posts",
        tabIcon: BookOpen,
        subMenuItems: [
          { label: "Dashboard", href: "posts", icon: LayoutDashboard },
          { label: "new", href: "posts/new", icon: FilePlus },
          { label: "List", href: "posts/list", icon: List },
          { label: "Categories", href: "posts/categories", icon: Tag },
          { label: "Comments", href: "posts/comments", icon: Star },
        ],
      },
      {
        tabName: "Courses",
        tabIcon: TvMinimalPlay,
        subMenuItems: [
          { label: "Dashboard", href: "courses", icon: LayoutDashboard },
          { label: "new", href: "courses/new", icon: FilePlus },
          { label: "List", href: "courses/list", icon: List },
          { label: "Categories", href: "courses/categories", icon: Tag },
          { label: "Reviews", href: "courses/reviews", icon: Star },
        ],
      },
      {
        tabName: "Announcements",
        tabIcon: GalleryHorizontal,
        subMenuItems: [
          { label: "Dashboard", href: "announcements", icon: LayoutDashboard },
          { label: "Sliders", href: "announcements", icon: LayoutDashboard },
          { label: "Notif Bar", href: "announcements/new", icon: FilePlus },
        ],
      },
    ],
  },

  {
    groupName: "Support & Communication",
    subMenuItems: [
      {
        tabName: "Tickets",
        tabIcon: MessageCircle,
        subMenuItems: [
          { label: "Dashboard", href: "tickets", icon: LayoutDashboard },
          { label: "New", href: "tickets/new", icon: List },
        ],
      },
      {
        tabName: "Contacts",
        tabIcon: Phone,
        subMenuItems: [
          { label: "Dashboard", href: "contacts", icon: LayoutDashboard },
          { label: "List", href: "contacts/list", icon: List },
        ],
      },
      {
        tabName: "SMS",
        tabIcon: Mail,
        subMenuItems: [
          { label: "Send SMS", href: "help-desk/tickets", icon: List },
        ],
      },
      {
        tabName: "EMAIL",
        tabIcon: AtSign,
        subMenuItems: [
          { label: "Inbox", href: "contacts/list", icon: List },
          { label: "Send Email", href: "contacts/list", icon: List },
        ],
      },
    ],
  },

  {
    groupName: "User Management",
    subMenuItems: [
      {
        tabName: "Students",
        tabIcon: Users,
        subMenuItems: [
          { label: "Dashboard", href: "students", icon: LayoutDashboard },
          { label: "List", href: "students/list", icon: List },
          { label: "new", href: "students/new", icon: List },
        ],
      },
      {
        tabName: "Registerations",
        tabIcon: UserPlus,
        subMenuItems: [
          { label: "Dashboard", href: "invoices", icon: LayoutDashboard },
          { label: "List", href: "invoices/list", icon: List },
        ],
      },
      {
        tabName: "Tutors",
        tabIcon: GraduationCap,
        subMenuItems: [
          { label: "Dashboard", href: "tutors", icon: LayoutDashboard },
          { label: "List", href: "tutors/list", icon: List },
        ],
      },
      {
        tabName: "Admins",
        tabIcon: UserRoundCheck,
        subMenuItems: [{ label: "List", href: "admins/list", icon: List }],
      },
    ],
  },

  {
    groupName: "Financial & Data",
    subMenuItems: [
      {
        tabName: "Payments",
        tabIcon: CreditCard,
        subMenuItems: [
          { label: "Dashboard", href: "payments", icon: LayoutDashboard },
          { label: "List", href: "payments/list", icon: List },
          { label: "New", href: "payments/new", icon: List },
        ],
      },
      {
        tabName: "Marketing",
        tabIcon: Percent,
        subMenuItems: [
          { label: "Dashboard", href: "invoices", icon: LayoutDashboard },
          { label: "Discount Codes", href: "invoices/list", icon: List },
          { label: "Overall Off", href: "invoices/list", icon: List },
        ],
      },
      {
        tabName: "Statistics",
        tabIcon: ChartBarBig,
        subMenuItems: [
          { label: "Overview", href: "statistics", icon: LayoutDashboard },
          { label: "Reports", href: "statistics/reports", icon: FileText },
        ],
      },
      {
        tabName: "Exports",
        tabIcon: FolderInput,
        subMenuItems: [
          { label: "Dashboard", href: "exports", icon: LayoutDashboard },
          { label: "Data Export", href: "exports/data", icon: FileText },
          { label: "Reports Export", href: "exports/reports", icon: FileText },
        ],
      },
    ],
  },
];

export default sideBarMenuItems;
