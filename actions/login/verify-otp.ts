"use server";

import { getOtpByIdentifier } from "@/data/otp";
import { getAdminByIdentifier } from "@/data/admin";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";

export const verifyOtp = async (otp: string, identifier: string) => {
  try {
    // OTP LOOK UP
    const existingOtp = await getOtpByIdentifier(identifier);

    // CHECK EXISTANCE
    if (!existingOtp) return { error: "Invalid Code" };

    // CHECK EXPIRATION
    const hasExpired = new Date(existingOtp.expires) < new Date();
    if (hasExpired) {
      return { error: `Code has been expired` };
    }

    // CHECK OTP
    const isValidOtp = await bcrypt.compare(otp, existingOtp.otpCode);
    if (!isValidOtp) return { error: "Invalid Code" };

    // DELETE OTP
    await prisma.otp.delete({
      where: {
        identifier: existingOtp.identifier,
      },
    });

    // FIND USER OF THIS OTP
    const existingAdmin = await getAdminByIdentifier(identifier);

    return { success: "Seccuess", role: existingAdmin?.role };
  } catch (error) {
    return { error: "Something Happended" };
  }
};
