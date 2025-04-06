import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encodeUrl(url: string) {
  return url.split(" ").join("-").trim();
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = minutes / 60;
    const roundedHours = Math.round(hours * 2) / 2;

    return roundedHours % 1 === 0
      ? `${roundedHours} hour`
      : `${roundedHours} hours`;
  }
}

export function formatPrice(
  price: number | undefined,
  options?: { noValuePlaceholder?: string; showNumber?: boolean }
) {
  if (!price)
    return options?.showNumber ? 0 + " t" : options?.noValuePlaceholder || "--";

  return price.toLocaleString("en-US") + " t";
}

export function truncateFileName(name: string, maxLength = 20) {
  if (name.length <= maxLength) return name;

  const extIndex = name.lastIndexOf(".");
  const extension = extIndex !== -1 ? name.slice(extIndex) : "";
  const baseName = name.slice(0, extIndex);

  return baseName.slice(0, 10) + "....." + baseName.slice(-10) + extension;
}

/**
 * Generic function to aggregate items by day.
 * @param items - Array of items to aggregate.
 * @param getDate - A function that extracts a day string (e.g. "2023-03-15") from an item.
 * @param getValue - A function that extracts a numeric value from an item.
 * @returns Array of objects in the form { date: string, value: number }.
 */
import { addDays, format, subDays } from "date-fns";

export function aggregateByDay<T>(
  items: T[],
  getDate: (item: T) => string,
  getValue: (item: T) => number,
  days: number = 13
): { date: string; value: number }[] {
  const endDate = new Date();
  const startDate = subDays(endDate, days);

  const aggregation: Record<string, number> = items.reduce(
    (acc, item) => {
      const day = getDate(item);
      acc[day] = (acc[day] || 0) + getValue(item);
      return acc;
    },
    {} as Record<string, number>
  );

  const result: { date: string; value: number }[] = [];
  for (
    let currentDate = startDate;
    currentDate <= endDate;
    currentDate = addDays(currentDate, 1)
  ) {
    const dayStr = currentDate.toISOString().split("T")[0];
    result.push({
      date: dayStr,
      value: aggregation[dayStr] || 0,
    });
  }

  return result;
}

export const formatNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1_000_000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  if (num < 1_000_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
};

type DataItem = {
  date: string;
  views: number;
  sessions: number;
};

export const getSumByTimeRange = (
  data: DataItem[],
  key: keyof DataItem,
  timeRange: string | number
): number => {
  const days = parseInt(timeRange.toString(), 10);
  if (isNaN(days) || days <= 0) return 0;

  const cutoffDate = format(subDays(new Date(), days), "yyyy-MM-dd");

  return data
    .filter((item) => item.date >= cutoffDate) // Filter data within range
    .reduce(
      (sum, item) => sum + (typeof item[key] === "number" ? item[key] : 0),
      0
    );
};

export function calculateSum(
  values: Array<Record<string, number | string>>,
  key: string
): number {
  return values.reduce((acc, curr) => acc + +curr[key], 0);
}
