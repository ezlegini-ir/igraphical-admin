import { useState } from "react";

const useImagePreview = (defaultPreview: string | undefined) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    defaultPreview
  );

  return { imagePreview, setImagePreview };
};

export default useImagePreview;
