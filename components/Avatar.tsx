import { avatar } from "@/public";
import Image from "next/image";
import React from "react";
import { Skeleton } from "./ui/skeleton";

const Avatar = ({ src, size }: { src: string | undefined; size?: number }) => {
  return (
    <div className=" rounded-full relative overflow-hidden aspect-square h-min border">
      <Skeleton className="absolute inset-0 -z-10" />
      <Image
        src={src || avatar}
        alt="avatar"
        width={size || 40}
        height={size || 40}
        className="rounded-full object-cover"
      />
    </div>
  );
};

export default Avatar;
