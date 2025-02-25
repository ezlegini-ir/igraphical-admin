import { useState } from "react";

const useLoginStep = <T extends string>(steps: T[]) => {
  const [loginStep, setLoginStep] = useState<T>(steps[0]);

  return { loginStep, setLoginStep };
};

export default useLoginStep;
