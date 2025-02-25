"use client";

import { CreditCard, MessageCircle, Users } from "lucide-react";
import StatCard from "../components/StatCard";
import { calculateSum } from "@/lib/calculate";

type statsDataType = {
  date: string;
  value: number;
}[];

interface Props {
  data: {
    revenue: statsDataType;
    students: statsDataType;
    solvedTickets: statsDataType;
  };
}

const StatCards = ({ data }: Props) => {
  const totalRevenue = calculateSum(data.revenue, "value");
  const totalStudents = calculateSum(data.students, "value");
  const totalSolvedTickets = calculateSum(data.solvedTickets, "value");

  return (
    <>
      <div className="col-span-3">
        <StatCard
          chartData={data.students}
          dataKey="value"
          total={totalStudents}
          icon={<Users size={18} />}
          title={"Students"}
          valueChange={30.5}
          colorVariant={"blue"}
        />
      </div>

      <div className="col-span-3">
        <StatCard
          chartData={data.revenue}
          dataKey="value"
          total={totalRevenue}
          icon={<CreditCard size={18} />}
          title={"Revenue"}
          valueChange={30.5}
          colorVariant={"green"}
        />
      </div>

      <div className="col-span-3">
        <StatCard
          chartData={data.solvedTickets}
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
