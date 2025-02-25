import { useState } from "react";

const useIdentifier = () => {
  const [identifier, setIdentifier] = useState("");

  return { identifier, setIdentifier };
};

export default useIdentifier;
