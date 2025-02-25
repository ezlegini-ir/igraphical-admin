"use server";

import { signIn } from "@/auth";
import { redirectAdmin } from "@/data/admin";
import { redirect } from "next/navigation";

export const authenticator = async (identifier: string) => {
  const signInResponse = await signIn("user-login", {
    identifier,
    redirect: false,
  });

  if (signInResponse?.error) return { error: "Invalid Credentials" };

  // redirect("/login/redirect");
  await redirectAdmin();
};
