type ChartData = {
  date: string;
  [key: string]: number | string;
};

export function compareDataByTimeRange<T extends keyof ChartData>(
  data: ChartData[],
  dataKey: T,
  timeRange: string
): number {
  const range = parseInt(timeRange, 10);
  if (isNaN(range) || range <= 0) return 0;

  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const recentData = sortedData.slice(-2 * range);
  if (recentData.length < 2 * range) return 0;

  const lastPeriod = recentData.slice(-range);
  const previousPeriod = recentData.slice(0, range);

  const calculateTotal = (dataset: ChartData[]) =>
    dataset.reduce((acc, curr) => {
      const value = curr[dataKey];
      return acc + (typeof value === "number" ? value : 0);
    }, 0);

  const lastTotal = calculateTotal(lastPeriod);
  const prevTotal = calculateTotal(previousPeriod);

  if (prevTotal === 0) return 0;

  const change = ((lastTotal - prevTotal) / prevTotal) * 100;
  return parseFloat(change.toFixed(2));
}
