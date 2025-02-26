"use client";

import { ChartConfig } from "@/components/ui/chart";

import MyLineChartWide from "@/components/MyCharts";
import useTimeRange from "@/hooks/useTimeRange";
import { compareDataByTimeRange } from "@/lib/compare-data";
import { getFormattedTotal } from "@/lib/format-total";
import { ArrowUpRight } from "lucide-react";
import RangeSelector from "./RangeSelector";

interface Props {
  chartData: {
    date: string;
    views: number;
    sessions: number;
  }[];
}

const ViewsChart = ({ chartData }: Props) => {
  const { timeRange, setTimeRange } = useTimeRange("30");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);

    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30") {
      daysToSubtract = 30;
    } else if (timeRange === "7") {
      daysToSubtract = 7;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return date > startDate;
  });

  const totalViews = getFormattedTotal(filteredData, "views");
  const totalSessions = getFormattedTotal(filteredData, "sessions");
  const viewsComparison = compareDataByTimeRange(chartData, "views", timeRange);
  const sessionsComparison = compareDataByTimeRange(
    chartData,
    "sessions",
    timeRange
  );

  return (
    <>
      <div className="card col-span-6 p-6 space-y-10">
        <div className="flex justify-between">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Views</span>
              <div className="flex gap-1">
                <span className="font-semibold text-xl">{totalViews}</span>
                <span
                  className={`flex text-xs ${
                    viewsComparison > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <ArrowUpRight size={16} /> {viewsComparison}%
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Sessions</span>
              <div className="flex gap-1">
                <span className="font-semibold text-xl">{totalSessions}</span>
                <span
                  className={`flex text-xs ${
                    viewsComparison > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <ArrowUpRight size={16} /> {sessionsComparison}%
                </span>
              </div>
            </div>
          </div>

          <RangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
        </div>

        <MyLineChartWide config={chartConfig} data={filteredData} />
      </div>
    </>
  );
};

export default ViewsChart;

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--chart-blue))",
  },
  sessions: {
    label: "Sessions",
    color: "hsl(var(--chart-orange))",
  },
} satisfies ChartConfig;
