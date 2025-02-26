import { useState } from "react";

const useValue = (defaultValue: string = "") => {
  const [value, setValue] = useState(defaultValue);

  return { value, setValue };
};

export default useValue;
