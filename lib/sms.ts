import { generateSmsOtp } from "./otp";
import { kavenegar } from "@/config/kavenegar";

export const sendOtpSms = async (phone: string) => {
  const { plainOtp } = await generateSmsOtp(phone);

  return kavenegar.VerifyLookup(
    {
      receptor: phone,
      token: plainOtp,
      template: "igraphical",
    },
    function (response, status) {
      // console.log(response);
      // console.log(status);
    }
  );
};

export const sendSms = (data: { message: string; receptor: string }) => {
  const { message, receptor } = data;

  return kavenegar.Send(
    {
      message,
      sender: "10003330303003",
      receptor,
    },
    function (response, status) {
      // console.log(response);
      // console.log(status);
    }
  );
};
