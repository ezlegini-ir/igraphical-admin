"use server";

import { getAdminByIdentifier } from "@/data/admin";
import { sendOtp } from "@/lib/otp";

export const verifyLogin = async (identifier: string, password: string) => {
  const existingAdmin = await getAdminByIdentifier(identifier);
  if (!existingAdmin) return { error: "Invalid Credentials" };

  //TODO: BCRYPT COMPARE
  const isValidPassword = existingAdmin.password === password;

  if (!isValidPassword) return { error: "Invalid Credentials" };

  await sendOtp(identifier);
};
