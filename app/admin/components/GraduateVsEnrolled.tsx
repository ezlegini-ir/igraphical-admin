"use client";

import { ChartConfig } from "@/components/ui/chart";
import { EllipsisVertical } from "lucide-react";
import RadialChartBar from "./RadialChartBar";

interface Props {
  chartData: { left: number; right: number }[];
}

const GraduateVsEnrolled = ({ chartData }: Props) => {
  const totalVisitors = chartData[0].left + chartData[0].right;

  return (
    <div className="card p-6 col-span-3 space-y-5">
      <div className="flex justify-between items-center">
        <p className="font-medium">Completion Rate</p>
        <EllipsisVertical size={18} className="text-gray-500" />
      </div>

      <RadialChartBar
        chartConfig={chartConfig}
        chartData={chartData}
        total={totalVisitors}
        dataKeys={{ left: "left", right: "right" }}
        label="Total Enrollments"
      />
    </div>
  );
};

export default GraduateVsEnrolled;

const chartConfig = {
  left: {
    label: "Completed",
    color: "hsl(var(--chart-blue))",
  },
  right: {
    label: "Enrolled",
    color: "hsl(var(--chart-lightBlue))",
  },
} satisfies ChartConfig;
