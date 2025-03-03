import {
  BookOpen,
  ChartBarBig,
  ChartNoAxesCombined,
  CreditCard,
  GalleryHorizontal,
  GraduationCap,
  MessageCircle,
  MessageCircleQuestion,
  Percent,
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
        tabHref: "/posts",
        tabIcon: BookOpen,
        subMenuItems: [
          { label: "new", href: "/posts/new" },
          { label: "List", href: "/posts/list" },
          { label: "Categories", href: "/posts/categories" },
          { label: "Comments", href: "/posts/comments" },
        ],
      },
      {
        tabName: "Courses",
        tabHref: "/courses",
        tabIcon: TvMinimalPlay,
        subMenuItems: [
          { label: "new", href: "/courses/new" },
          { label: "List", href: "/courses/list" },
          { label: "Categories", href: "/courses/categories" },
          { label: "Reviews", href: "/courses/reviews" },
        ],
      },
      {
        tabName: "Announcements",
        tabHref: "/announcements",
        tabIcon: GalleryHorizontal,
        subMenuItems: [],
      },
    ],
  },

  {
    groupName: "Financial & Data",
    subMenuItems: [
      {
        tabName: "Payments",
        tabHref: "/payments",
        tabIcon: CreditCard,
        subMenuItems: [
          { label: "List", href: "/payments/list" },
          { label: "New", href: "/payments/new" },
        ],
      },
      {
        tabName: "Marketing",
        tabHref: "/marketing",
        tabIcon: Percent,
        subMenuItems: [
          { label: "Coupons", href: "/marketing/coupons" },
          { label: "Overall Off", href: "/marketing/overall-off" },
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
        tabHref: "/tickets",
        tabIcon: MessageCircle,
        subMenuItems: [
          { label: "New", href: "/tickets/new" },
          { label: "List", href: "/tickets/list" },
        ],
      },
      {
        tabName: "Q & A",
        tabHref: "/qa",
        tabIcon: MessageCircleQuestion,
        subMenuItems: [],
      },
      // {
      //   tabName: "Contacts",
      //   tabHref: "/contacts",
      //   tabIcon: Phone,
      //   subMenuItems: [{ label: "List", href: "contacts/list", }],
      // },
      // {
      //   tabName: "SMS",
      // tabHref: "sms",
      //   tabIcon: Mail,
      //   subMenuItems: [
      //     { label: "Send SMS", href: "help-desk/tickets", },
      //   ],
      // },
      // {
      //   tabName: "EMAIL",
      // tabHref: "email",
      //   tabIcon: AtSign,
      //   subMenuItems: [
      //     { label: "Inbox", href: "contacts/list", },
      //     { label: "Send Email", href: "contacts/list", },
      //   ],
      // },
    ],
  },

  {
    groupName: "User Management",
    subMenuItems: [
      {
        tabName: "Students",
        tabHref: "/students",
        tabIcon: Users,
        subMenuItems: [],
      },
      {
        tabName: "Tutors",
        tabHref: "/tutors",
        tabIcon: GraduationCap,
        subMenuItems: [],
      },
      {
        tabName: "Admins",
        tabHref: "/admins",
        tabIcon: UserRoundCheck,
        subMenuItems: [],
      },
    ],
  },

  {
    groupName: "Data Analysis",
    subMenuItems: [
      {
        tabName: "Analysis",
        tabHref: "/analysis",
        tabIcon: ChartBarBig,
        subMenuItems: [
          { label: "Overview", href: "/analysis" },
          { label: "Earnings", href: "/statistics/earnings" },
          { label: "Coupons", href: "/statistics/coupons" },
          { label: "Registrations", href: "/statistics/registrations" },
          { label: "Ratings", href: "/statistics/ratings" },
          { label: "Instructors", href: "/statistics/instructors" },
          { label: "Students", href: "/statistics/students" },
          { label: "Tickets", href: "/statistics/tickets" },
        ],
      },

      {
        tabName: "Statistics",
        tabHref: "/statistics",
        tabIcon: ChartNoAxesCombined,
        subMenuItems: [
          { label: "Overview", href: "/statistics" },
          { label: "Views", href: "/statistics/views" },
          { label: "Pages", href: "/statistics/pages" },
          { label: "Courses", href: "/statistics/courses" },
          { label: "Refers", href: "/statistics/refers" },
          { label: "Devices", href: "/statistics/refers" },
        ],
      },
    ],
  },
];

export default sideBarMenuItems;
