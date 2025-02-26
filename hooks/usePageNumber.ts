import { useState } from "react";

const usePageNumber = () => {
  const [pageNumber, setPageNumber] = useState(1);

  return { pageNumber, setPageNumber };
};

export default usePageNumber;
