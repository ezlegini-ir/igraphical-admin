import axios from "axios";

export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY!;

  const { data } = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify`,
    null,
    {
      params: {
        secret,
        response: token,
      },
    }
  );

  return data.success && data.score > 0.7;
}

export async function isHumanOrNot(token: string) {
  const isHuman = await verifyRecaptcha(token);

  if (!isHuman) {
    throw new Error("You've Noticed as a Bot, Please Try Again...");
  }
}
