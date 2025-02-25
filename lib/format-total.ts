type DataItem = { [key: string]: number | string };

export const getFormattedTotal = (data: DataItem[], key: string): string => {
  const total = data.reduce(
    (acc, curr) =>
      acc + (typeof curr[key] === "number" ? (curr[key] as number) : 0),
    0
  );
  return total >= 1000 ? (total / 1000).toFixed(1) + "K" : total.toString();
};
