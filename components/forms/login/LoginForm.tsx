"use client";

import { useState } from "react";
import InputForm from "./InputForm";
import OtpForm from "./OtpForm";
import useIdentifier from "@/hooks/useIdentifier";
import useLoginStep from "@/hooks/useLoginStep";

const LoginForm = () => {
  // HOOKS
  const { loginStep, setLoginStep } = useLoginStep(["INPUT", "OTP"]);
  const { identifier, setIdentifier } = useIdentifier();

  return (
    <>
      {loginStep === "INPUT" && (
        <InputForm setLoginStep={setLoginStep} setIdentifier={setIdentifier} />
      )}

      {loginStep === "OTP" && (
        <OtpForm setLoginStep={setLoginStep} identifier={identifier} />
      )}
    </>
  );
};

export default LoginForm;
