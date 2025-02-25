import { useState } from "react";

const useTimeRange = (defaultRange: string) => {
  const [timeRange, setTimeRange] = useState(defaultRange);

  return { timeRange, setTimeRange };
};

export default useTimeRange;
