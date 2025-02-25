import LoginForm from "@/components/forms/login/LoginForm";
import IgraphLogo from "@/components/IgraphLogo";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";

const page = () => {
  return (
    <div className="flex flex-col gap-5 items-center">
      <Link href={"#"}>
        <IgraphLogo />
      </Link>

      <div className="card p-5 w-full space-y-3">
        <LoginForm />
      </div>
    </div>
  );
};

export default page;
