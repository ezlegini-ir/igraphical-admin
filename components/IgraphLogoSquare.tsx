import { igraphLogoCard } from "@/public";
import Image from "next/image";
import React from "react";

interface Props {
  size?: number;
  inputProps?: any;
}

const IgraphLogoSquare = ({ size, inputProps }: Props) => {
  return (
    <Image
      src={igraphLogoCard}
      alt={"iGraph"}
      width={size || 50}
      height={size || 50}
      draggable={false}
      {...inputProps}
      className="hover:scale-105 transition-transform"
    />
  );
};

export default IgraphLogoSquare;
