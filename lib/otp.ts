import { prisma } from "@igraphical/core";
import bcrypt from "bcrypt";
import { sendOtpSms } from "./sms";
import { sendOtpEmail } from "./mail";
import { detectInputType } from "./detectInputType";
import { getOtpByIdentifier } from "@/data/otp";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
const generateExpires = (minute: number) => {
  return new Date(new Date().getTime() + minute * 60 * 1000); // 1min
};

export const generateSmsOtp = async (identifier: string) => {
  // GENERATE DAYA
  const plainOtp = generateOtp();
  const expires = generateExpires(2); //2min

  // LOOK UP USER
  const existingToken = await prisma.otp.findFirst({
    where: { identifier },
  });

  if (existingToken)
    await prisma.otp.delete({
      where: { identifier },
    });

  // HASH OTP
  const hashedOTP = await bcrypt.hash(plainOtp, 10);

  await prisma.otp.create({
    data: {
      expires,
      identifier,
      otpCode: hashedOTP,
      type: "SMS",
    },
  });

  return { plainOtp };
};

export const generateEmailOtp = async (identifier: string) => {
  // GENERATE DAYA
  const plainOtp = generateOtp();
  const expires = generateExpires(2); //2min

  // LOOK UP USER
  const existingToken = await getOtpByIdentifier(identifier);

  if (existingToken)
    await prisma.otp.delete({
      where: { identifier },
    });

  // HASH OTP
  const hashedOTP = await bcrypt.hash(plainOtp, 10);

  await prisma.otp.create({
    data: {
      expires,
      identifier,
      otpCode: hashedOTP,
      type: "EMAIL",
    },
  });

  return { plainOtp };
};

export const sendOtp = async (identifier: string) => {
  const inputType = detectInputType(identifier);

  if (inputType === "phone") {
    await sendOtpSms(identifier);
  } else {
    await sendOtpEmail(identifier);
  }
};
