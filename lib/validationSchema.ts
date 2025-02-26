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
  otp: z.string().min(6),
});
export type OtpType = z.infer<typeof otpFormSchema>;

//! POSTS
export const postFormSchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
  image: z.instanceof(File),
  content: z.string().min(1),
  categories: z.array(z.string()),
  status: z.enum(["0", "1"]),
  author: z.string().min(1),
});
export type PostFormType = z.infer<typeof postFormSchema>;
// --------------
export const categoryFormSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
});
export type CategoryFormType = z.infer<typeof categoryFormSchema>;
// --------------
export const commentFormSchema = z.object({
  content: z.string().min(1),
  user: z.string(),
  date: z.date(),
  post: z.string(),
});
export type CommentFormType = z.infer<typeof commentFormSchema>;

//! ADMINS
export const adminRoles = ["ADMIN", "AUTHOR"] as const;
export const adminFormSchema = z.object({
  name: z.string().min(1),
  displayName: z.string().min(1),
  role: z.enum(adminRoles),
  email: z.string().min(1),
  phone: z.string().min(1),
  password: z.string().optional(),
});
export type AdminFormType = z.infer<typeof adminFormSchema>;
