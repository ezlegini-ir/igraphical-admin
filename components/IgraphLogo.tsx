import { igraphLogo } from "@/public";
import Image from "next/image";
import React from "react";

interface Props {
  size?: number;
  inputProps?: any;
  className?: string;
}

const IgraphLogo = ({ inputProps, className, size }: Props) => {
  return (
    <Image
      src={igraphLogo}
      alt={"iGraph"}
      width={size || 130}
      height={size || 130}
      draggable={false}
      {...inputProps}
      className={className}
    />
  );
};

export default IgraphLogo;
