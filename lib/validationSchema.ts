import z from "zod";

const requiredMessage = "Required";

//! LOGIN FORM
export const loginFormSchema = z.object({
  phoneOrEmail: z
    .string()
    .trim()
    .refine((val) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?\d{11,15}$/;

      return emailRegex.test(val) || phoneRegex.test(val);
    }, "invalid phone or emai"),
  password: z.string().min(8, { message: requiredMessage }),
});
export type LoginFormType = z.infer<typeof loginFormSchema>;

// --------------

export const otpFormSchema = z.object({
  otp: z.string().min(6, { message: "کد احراز هویت 5 رقمی می باشد" }),
});
export type OtpType = z.infer<typeof otpFormSchema>;

//! POSTS
export const postFormSchema = z.object({
  title: z.string(),
  url: z.string(),
  image: z.instanceof(File),
  content: z.string(),
  categories: z.array(z.string()),
  status: z.enum(["0", "1"]),
  author: z.string(),
});
export type PostFormType = z.infer<typeof postFormSchema>;
