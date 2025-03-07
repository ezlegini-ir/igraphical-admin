import { formatDistance, differenceInHours } from "date-fns";

export const formatDate = (date: Date): string => {
  const hoursDiff = differenceInHours(new Date(), date);
  if (hoursDiff < 120) {
    return formatDistance(date, new Date(), { addSuffix: true });
  }
  return date.toLocaleString();
};
