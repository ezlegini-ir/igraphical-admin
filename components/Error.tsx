import { TriangleAlert } from "lucide-react";
import React from "react";

const Error = ({
  error,
  className,
  icon = true,
}: {
  error: string;
  className?: string;
  icon?: boolean;
}) => {
  if (!error) return null;

  return (
    <p
      className={`alert alert-danger mb-3 flex items-center justify-center gap-1 ${className}`}
    >
      {icon && <TriangleAlert size={20} />}
      {error}
    </p>
  );
};

export default Error;
