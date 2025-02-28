"use server";

import { getAdminByIdentifier } from "@/data/admin";
import { sendOtp } from "@/lib/otp";
import bcrypt from "bcrypt";

export const verifyLogin = async (identifier: string, password: string) => {
  const existingAdmin = await getAdminByIdentifier(identifier);
  if (!existingAdmin) return { error: "Invalid Credentials" };

  //TODO: BCRYPT COMPARE
  const isValidPassword = await bcrypt.compare(
    password,
    existingAdmin.password
  );

  if (!isValidPassword) return { error: "Invalid Credentials" };

  await sendOtp(identifier);
};
