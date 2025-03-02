import { formatDistance, differenceInHours } from "date-fns";

export const formatDate = (date: Date): string => {
  const hoursDiff = differenceInHours(new Date(), date);
  if (hoursDiff < 168) {
    // This returns a string like "about 1 hour ago" or "10 minutes ago"
    return formatDistance(date, new Date(), { addSuffix: true });
  }
  // For dates older than one day, return the full date string
  return date.toLocaleString();
};
