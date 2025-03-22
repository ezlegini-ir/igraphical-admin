"use client";

import { CreditCard, MessageCircle, Users } from "lucide-react";
import StatCard from "./StatCard";
import { calculateSum } from "@/lib/calculate";

type statsDataType = {
  date: string;
  value: number;
}[];

interface Props {
  revenue: statsDataType;
  students: statsDataType;
  solvedTickets: statsDataType;
}

const StatCards = ({ revenue, solvedTickets, students }: Props) => {
  const totalRevenue = calculateSum(revenue, "value");
  const totalStudents = calculateSum(students, "value");
  const totalSolvedTickets = calculateSum(solvedTickets, "value");

  const responsiveStyles = "col-span-12 sm:col-span-6 xl:col-span-3";

  return (
    <>
      <div className={responsiveStyles}>
        <StatCard
          chartData={students}
          dataKey="value"
          total={totalStudents}
          icon={<Users size={18} />}
          title={"Students"}
          valueChange={30.5}
          colorVariant={"blue"}
          chartType="line"
        />
      </div>

      <div className={responsiveStyles}>
        <StatCard
          chartData={revenue}
          dataKey="value"
          total={totalRevenue}
          icon={<CreditCard size={18} />}
          title={"Revenue"}
          valueChange={30.5}
          colorVariant={"green"}
          chartType="line"
        />
      </div>

      <div className={responsiveStyles}>
        <StatCard
          chartData={solvedTickets}
          dataKey="value"
          total={totalSolvedTickets}
          icon={<MessageCircle size={18} />}
          title={"Solved Tickets"}
          valueChange={30.5}
          colorVariant={"orange"}
          chartType="line"
        />
      </div>
    </>
  );
};

export default StatCards;
