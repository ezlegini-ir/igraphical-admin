type ChartData = {
  date: string;
  [key: string]: number | string; // Allows flexibility for numeric keys
};

export function compareDataByTimeRange<T extends keyof ChartData>(
  data: ChartData[],
  dataKey: T,
  timeRange: string
): number {
  const range = parseInt(timeRange, 10);
  if (isNaN(range) || range <= 0) return 0; // Handle invalid range input

  // Sort data by date (oldest to newest) without mutating the original array
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get the last (2 * range) days of data
  const recentData = sortedData.slice(-2 * range);
  if (recentData.length < 2 * range) return 0; // Insufficient data

  // Split into two periods
  const lastPeriod = recentData.slice(-range);
  const previousPeriod = recentData.slice(0, range);

  // Calculate total for the given dataKey
  const calculateTotal = (dataset: ChartData[]) =>
    dataset.reduce((acc, curr) => {
      const value = curr[dataKey];
      return acc + (typeof value === "number" ? value : 0);
    }, 0);

  const lastTotal = calculateTotal(lastPeriod);
  const prevTotal = calculateTotal(previousPeriod);

  // Calculate percentage change
  if (prevTotal === 0) return 0; // Avoid division by zero

  const change = ((lastTotal - prevTotal) / prevTotal) * 100;
  return parseFloat(change.toFixed(2));
}
