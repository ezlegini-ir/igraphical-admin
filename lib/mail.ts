import nodemailer from "nodemailer";
import { generateEmailOtp } from "./otp";

const transporter = nodemailer.createTransport({
  host: "mail.igraphical.ir",
  port: 465,
  secure: true,
  auth: {
    user: "test@igraphical.ir",
    pass: process.env.NEXT_PUBLIC_MAIL_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"آی‌گرافیکال" <test@igraphical.ir>`,
      to,
      subject,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error };
  }
};

// VERIFY EMAIL
export const sendOtpEmail = async (email: string) => {
  const { plainOtp } = await generateEmailOtp(email);

  await transporter.sendMail({
    from: `"آی‌گرافیکال" <test@igraphical.ir>`,
    to: email,
    subject: `کد تایید شما: ${plainOtp}`,
    html: `<p>کد تایید شما: ${plainOtp}</p>`,
  });
};
