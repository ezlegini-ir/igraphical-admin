import GraduateVsEnrolled from "./components/GraduateVsEnrolled";
import RecentComments from "./components/RecentComments";
import RecentReviews from "./components/RecentReviews";
import StatCards from "./components/StatCards";
import TopDataCards from "./components/TopDataCards";
import TopViewedPages from "./components/TopViewedPages";
import ViewsChart from "./components/ViewsChart";
import ViewsTable from "./components/ViewTable";

const page = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <StatCards data={statsCardsData} />

      <GraduateVsEnrolled chartData={GraduateVsEnrolledChartData} />

      <ViewsChart chartData={viewsChartData} />

      <ViewsTable tableData={tableData} />

      <TopViewedPages topViewedPages={topViewedPages} />

      <RecentReviews reviews={reviews} />

      <RecentComments comments={comments} />

      <TopDataCards />
    </div>
  );
};

export default page;

const viewsChartData = [
  { date: "2024-04-01", views: 222, sessions: 150 },
  { date: "2024-04-02", views: 97, sessions: 180 },
  { date: "2024-04-03", views: 167, sessions: 120 },
  { date: "2024-04-04", views: 242, sessions: 260 },
  { date: "2024-04-05", views: 373, sessions: 290 },
  { date: "2024-04-06", views: 301, sessions: 340 },
  { date: "2024-04-07", views: 245, sessions: 180 },
  { date: "2024-04-08", views: 409, sessions: 320 },
  { date: "2024-04-09", views: 59, sessions: 110 },
  { date: "2024-04-10", views: 261, sessions: 190 },
  { date: "2024-04-11", views: 327, sessions: 350 },
  { date: "2024-04-12", views: 292, sessions: 210 },
  { date: "2024-04-13", views: 342, sessions: 380 },
  { date: "2024-04-14", views: 137, sessions: 220 },
  { date: "2024-04-15", views: 120, sessions: 170 },
  { date: "2024-04-16", views: 138, sessions: 190 },
  { date: "2024-04-17", views: 446, sessions: 360 },
  { date: "2024-04-18", views: 364, sessions: 410 },
  { date: "2024-04-19", views: 243, sessions: 180 },
  { date: "2024-04-20", views: 89, sessions: 150 },
  { date: "2024-04-21", views: 137, sessions: 200 },
  { date: "2024-04-22", views: 224, sessions: 170 },
  { date: "2024-04-23", views: 138, sessions: 230 },
  { date: "2024-04-24", views: 387, sessions: 290 },
  { date: "2024-04-25", views: 215, sessions: 250 },
  { date: "2024-04-26", views: 75, sessions: 130 },
  { date: "2024-04-27", views: 383, sessions: 420 },
  { date: "2024-04-28", views: 122, sessions: 180 },
  { date: "2024-04-29", views: 315, sessions: 240 },
  { date: "2024-04-30", views: 454, sessions: 380 },
  { date: "2024-05-01", views: 165, sessions: 220 },
  { date: "2024-05-02", views: 293, sessions: 310 },
  { date: "2024-05-03", views: 247, sessions: 190 },
  { date: "2024-05-04", views: 385, sessions: 420 },
  { date: "2024-05-05", views: 481, sessions: 390 },
  { date: "2024-05-06", views: 498, sessions: 520 },
  { date: "2024-05-07", views: 388, sessions: 300 },
  { date: "2024-05-08", views: 149, sessions: 210 },
  { date: "2024-05-09", views: 227, sessions: 180 },
  { date: "2024-05-10", views: 293, sessions: 330 },
  { date: "2024-05-11", views: 335, sessions: 270 },
  { date: "2024-05-12", views: 197, sessions: 240 },
  { date: "2024-05-13", views: 197, sessions: 160 },
  { date: "2024-05-14", views: 448, sessions: 490 },
  { date: "2024-05-15", views: 473, sessions: 380 },
  { date: "2024-05-16", views: 338, sessions: 400 },
  { date: "2024-05-17", views: 499, sessions: 420 },
  { date: "2024-05-18", views: 315, sessions: 350 },
  { date: "2024-05-19", views: 235, sessions: 180 },
  { date: "2024-05-20", views: 177, sessions: 230 },
  { date: "2024-05-21", views: 82, sessions: 140 },
  { date: "2024-05-22", views: 81, sessions: 120 },
  { date: "2024-05-23", views: 252, sessions: 290 },
  { date: "2024-05-24", views: 294, sessions: 220 },
  { date: "2024-05-25", views: 201, sessions: 250 },
  { date: "2024-05-26", views: 213, sessions: 170 },
  { date: "2024-05-27", views: 420, sessions: 460 },
  { date: "2024-05-28", views: 233, sessions: 190 },
  { date: "2024-05-29", views: 78, sessions: 130 },
  { date: "2024-05-30", views: 340, sessions: 280 },
  { date: "2024-05-31", views: 178, sessions: 230 },
  { date: "2024-06-01", views: 178, sessions: 200 },
  { date: "2024-06-02", views: 470, sessions: 410 },
  { date: "2024-06-03", views: 103, sessions: 160 },
  { date: "2024-06-04", views: 439, sessions: 380 },
  { date: "2024-06-05", views: 88, sessions: 140 },
  { date: "2024-06-06", views: 294, sessions: 250 },
  { date: "2024-06-07", views: 323, sessions: 370 },
  { date: "2024-06-08", views: 385, sessions: 320 },
  { date: "2024-06-09", views: 438, sessions: 480 },
  { date: "2024-06-10", views: 155, sessions: 200 },
  { date: "2024-06-11", views: 92, sessions: 150 },
  { date: "2024-06-12", views: 492, sessions: 420 },
  { date: "2024-06-13", views: 81, sessions: 130 },
  { date: "2024-06-14", views: 426, sessions: 380 },
  { date: "2024-06-15", views: 307, sessions: 350 },
  { date: "2024-06-16", views: 371, sessions: 310 },
  { date: "2024-06-17", views: 475, sessions: 520 },
  { date: "2024-06-18", views: 107, sessions: 170 },
  { date: "2024-06-19", views: 341, sessions: 290 },
  { date: "2024-06-20", views: 408, sessions: 450 },
  { date: "2024-06-21", views: 169, sessions: 210 },
  { date: "2024-06-22", views: 317, sessions: 270 },
  { date: "2024-06-23", views: 480, sessions: 530 },
  { date: "2024-06-24", views: 132, sessions: 180 },
  { date: "2024-06-25", views: 141, sessions: 190 },
  { date: "2024-06-26", views: 434, sessions: 380 },
  { date: "2024-06-27", views: 448, sessions: 490 },
  { date: "2024-06-28", views: 149, sessions: 200 },
  { date: "2024-06-29", views: 103, sessions: 160 },
  { date: "2024-06-30", views: 446, sessions: 400 },
];

const tableData = [
  { title: "Today", sessions: 131, views: 173 },
  { title: "Last Day", sessions: 90, views: 131 },
  { title: "This Month", sessions: 143, views: 189 },
  { title: "Last Month", sessions: 131, views: 243 },
  { title: "This Year", sessions: 110, views: 131 },
  { title: "Total", sessions: 90, views: 243 },
];

const GraduateVsEnrolledChartData = [{ left: 1260, right: 650 }];

const topViewedPages = [
  { page: "دوره جامع نرم افزار ادوبی ایلوستریتور", href: "#1", views: 21452 },
  { page: "دوره جامع نرم افزار ادوبی فتوشاپ", href: "#2", views: 5322 },
  { page: "دوره جامع طراحی بسته بندی و لیبل", href: "#4", views: 2134 },
  { page: "دوره جامع نرم افزار ادوبی ایلوستریتور", href: "#7", views: 1242 },
  { page: "دوره جامع نرم افزار ادوبی ایلوستریتور", href: "#6", views: 12441 },
  { page: "دوره جامع نرم افزار ادوبی ایندیزاین", href: "#5", views: 1234 },
  {
    page: "چطور سواچ های ایلوستریتور را نصب کنیم؟ راهنمای جامع",
    href: "#3",
    views: 123,
  },
];

const reviews = [
  {
    review: `بهترین بود خیلی ممنون ازتون خیلی حرفه ای و عالی و روان توضیح دادن استاد
        خسته نباشید موفق باشید`,
    rate: 5,
    course: {
      href: "#",
      title: "دوره جامع نرم افزار ادوبی ایندیزاین",
    },
    student: { name: "نگین صالحی", href: "#" },
  },
  {
    review: `سلام وقت بخیر تکنیک های چاپی دستگاه فلکسو و هلیو هم توی این دوره بصورت تخصصی آموزش داده میشه؟ من بیشتر نیازم به این دوره برای طراحی دایلاین های خاصه و بسته بندی فلکسو و استانداردهاش`,
    rate: 4,
    course: {
      href: "#",
      title: "دوره جامع نرم افزار ادوبی فتوشاپ",
    },
    student: { name: "تورج بهرامی", href: "#" },
  },
  {
    review: `بهترین بود خیلی ممنون ازتون خیلی حرفه ای و عالی و روان توضیح دادن استاد
        خسته نباشید موفق باشید`,
    rate: 2,
    course: {
      href: "#",
      title: "دوره جامع نرم افزار ادوبی ایندیزاین",
    },
    student: { name: "علیرضا ازلگینی", href: "#" },
  },
  {
    review: `سلام وقت بخیر تکنیک های چاپی دستگاه فلکسو و هلیو هم توی این دوره بصورت تخصصی آموزش داده میشه؟ من بیشتر نیازم به این دوره برای طراحی دایلاین های خاصه و بسته بندی فلکسو و استانداردهاش`,
    rate: 4,
    course: {
      href: "#",
      title: "دوره جامع نرم افزار ادوبی فتوشاپ",
    },
    student: { name: "تورج بهرامی", href: "#" },
  },
];

const comments = [
  {
    comment: `بهترین بود خیلی ممنون ازتون خیلی حرفه ای و عالی و روان توضیح دادن استاد
        خسته نباشید موفق باشید`,
    author: "علیرضا ازلگینی",
    post: {
      href: "#",
      title: "۶ نکته مهم برای ایجاد گرادینت بهتر",
    },
  },
  {
    comment: `سلام وقت بخیر تکنیک های چاپی دستگاه فلکسو و هلیو هم توی این دوره بصورت تخصصی آموزش داده میشه؟ من بیشتر نیازم به این دوره برای طراحی دایلاین های خاصه و بسته بندی فلکسو و استانداردهاش`,
    author: "علیرضا ازلگینی",
    post: {
      href: "#",
      title: "نرم افزار بلندر چیست؟ + کاربرد ها",
    },
  },
  {
    comment: `بهترین بود خیلی ممنون ازتون خیلی حرفه ای و عالی و روان توضیح دادن استاد
        خسته نباشید موفق باشید`,
    author: "علیرضا ازلگینی",
    post: {
      href: "#",
      title: " 11 تا از اساسی ترین کلید های میانبر فتوشاپ",
    },
  },
  {
    comment: `سلام وقت بخیر تکنیک های چاپی دستگاه فلکسو و هلیو هم توی این دوره بصورت تخصصی آموزش داده میشه؟ من بیشتر نیازم به این دوره برای طراحی دایلاین های خاصه و بسته بندی فلکسو و استانداردهاش`,
    author: "علیرضا ازلگینی",
    post: {
      href: "#",
      title: "نرم افزار بلندر چیست؟ + کاربرد ها",
    },
  },
];

const statsCardsData = {
  revenue: [
    { date: "2024-01-01", value: 186 },
    { date: "2024-01-02", value: 160 },
    { date: "2024-01-03", value: 237 },
    { date: "2024-01-04", value: 90 },
    { date: "2024-01-05", value: 209 },
    { date: "2024-01-06", value: 214 },
    { date: "2024-01-07", value: 186 },
    { date: "2024-01-08", value: 380 },
    { date: "2024-01-09", value: 237 },
    { date: "2024-01-10", value: 73 },
    { date: "2024-01-11", value: 209 },
    { date: "2024-01-12", value: 214 },
  ],
  students: [
    { date: "2024-01-01", value: 186 },
    { date: "2024-01-02", value: 160 },
    { date: "2024-01-03", value: 237 },
    { date: "2024-01-04", value: 90 },
    { date: "2024-01-05", value: 209 },
    { date: "2024-01-06", value: 214 },
    { date: "2024-01-07", value: 186 },
    { date: "2024-01-08", value: 380 },
    { date: "2024-01-09", value: 237 },
    { date: "2024-01-10", value: 73 },
    { date: "2024-01-11", value: 209 },
    { date: "2024-01-12", value: 214 },
  ],
  solvedTickets: [
    { date: "2024-01-01", value: 186 },
    { date: "2024-01-02", value: 160 },
    { date: "2024-01-03", value: 237 },
    { date: "2024-01-04", value: 90 },
    { date: "2024-01-05", value: 209 },
    { date: "2024-01-06", value: 214 },
    { date: "2024-01-07", value: 186 },
    { date: "2024-01-08", value: 380 },
    { date: "2024-01-09", value: 237 },
    { date: "2024-01-10", value: 73 },
    { date: "2024-01-11", value: 209 },
    { date: "2024-01-12", value: 214 },
  ],
};
