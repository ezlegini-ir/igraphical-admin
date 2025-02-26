import { useState } from "react";

const useFileName = () => {
  const [fileName, setFileName] = useState<string | null>(null);

  return { fileName, setFileName };
};

export default useFileName;
