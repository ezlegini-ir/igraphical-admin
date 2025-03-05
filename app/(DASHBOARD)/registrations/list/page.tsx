import Filter from "@/components/Filter";
import NewButton from "@/components/NewButton";
import Search from "@/components/Search";
import PaymentsList, { Payment } from "./PaymentsList";
import { coursePic, profile, profile2 } from "@/public";
interface Props {
  searchParams: Promise<{ page: string; filer: string; search: string }>;
}

const totalPayments = 15;

const page = async ({ searchParams }: Props) => {
  // const { page, filer, search } = await searchParams;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>Payments</h3>
        <div className="flex gap-3 justify-between items-center">
          <Search />

          <Filter
            defaultValue="all"
            placeholder="All Payments"
            name="status"
            options={[
              { label: "All Payments", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Canceled", value: "canceled" },
              { label: "Submitted", value: "submitted" },
            ]}
          />

          <NewButton href="/payments/new" title="New Payment" />
        </div>
      </div>

      <PaymentsList payments={payments} totalPayments={totalPayments} />
    </div>
  );
};

const payments: Payment[] = [
  {
    courses: [
      {
        id: "1",
        image: { url: coursePic },
        title: "دوره جامع نرم افزار ادوبی ایلوستریتور",
      },
      {
        id: "2",
        image: { url: profile },
        title: "دوره جامع نرم افزار ادوبی ایلوستریتور",
      },
      {
        id: "3",
        image: { url: profile2 },
        title: "دوره جامع نرم افزار ادوبی ایلوستریتور",
      },
    ],
    date: new Date("2025-03-02 20:13:15"),
    id: 151232,
    status: "SUBMITTED",
    total: 1878000,
    user: {
      firstName: "فاطمه",
      lastName: "احمدی",
      id: "1",
      phone: "09127452859",
      email: "ezlegini.ir@gmail.com",
    },
  },
  {
    courses: [
      {
        id: "1",
        image: { url: coursePic },
        title: "دوره جامع نرم افزار ادوبی ایلوستریتور",
      },
    ],
    // discount: {
    //   amount: 100000,
    //   code: "igraphical",
    // },
    date: new Date("2025-03-02 20:01:15"),
    id: 151235,
    status: "SUBMITTED",
    total: 1878000,
    user: {
      firstName: "مهدی",
      lastName: "احمدی",
      id: "1",
      phone: "09127452859",
      email: "ezlegini.ir@gmail.com",
    },
  },
  {
    discount: {
      amount: 100000,
      code: "igraphical",
    },
    courses: [
      {
        id: "1",
        image: { url: coursePic },
        title: "دوره جامع نرم افزار ادوبی ایلوستریتور",
      },
    ],
    date: new Date("2025-01-01"),
    id: 151233,
    status: "CANCELED",
    total: 233500,
    user: {
      firstName: "علیرضا",
      lastName: "ازلگینی",
      id: "1",
      phone: "09127452859",
      email: "ezlegini.ir@gmail.com",
    },
  },
  {
    discount: {
      amount: 100000,
      code: "igraphical",
    },
    courses: [
      {
        id: "1",
        image: { url: coursePic },
        title: "دوره جامع نرم افزار ادوبی ایلوستریتور",
      },
    ],
    date: new Date("2024-01-01"),
    id: 151234,
    status: "PENDING",
    total: 1273000,
    user: {
      firstName: "محمد امین",
      lastName: "برهانی",
      id: "1",
      phone: "09127452859",
      email: "ezlegini.ir@gmail.com",
    },
  },
];

export default page;
