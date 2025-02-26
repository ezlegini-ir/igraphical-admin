import { useState } from "react";

const useImagePreview = (defaultPreview: string | undefined) => {
  const [imagePreview, setImagePreview] = useState<string | null | undefined>(
    defaultPreview
  );

  return { imagePreview, setImagePreview };
};

export default useImagePreview;
