import { mailer } from "@/config/mailer";
import { generateEmailOtp } from "./otp";

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
    const info = await mailer.sendMail({
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

  await mailer.sendMail({
    from: `"آی‌گرافیکال" <${process.env.MAIL_USER}>`,
    to: email,
    subject: `کد تایید شما: ${plainOtp}`,
    html: `<p>کد تایید شما: ${plainOtp}</p>`,
  });
};
