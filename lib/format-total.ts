type DataItem = { date: string; [key: string]: number | string };

export const getFormattedTotal = (
  data: DataItem[],
  key: string,
  timeRange: string
): string => {
  const range = parseInt(timeRange, 10);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - range - 1);

  const filteredData = data.filter((item) => new Date(item.date) >= startDate);

  const total = filteredData.reduce(
    (acc, curr) =>
      typeof curr[key] === "number" ? acc + (curr[key] as number) : acc,
    0
  );

  return total >= 1000 ? (total / 1000).toFixed(1) + "K" : total.toString();
};
