import React from "react";

const Title = ({
  title,
  tag,
  className,
}: {
  title: string;
  tag?: "h1" | "h2" | "h3" | "h4";
  className?: string;
}) => {
  return (
    <h2 className={`text-sm text-gray-500 font-medium ${className}`}>
      {title}
    </h2>
  );
};

export default Title;
