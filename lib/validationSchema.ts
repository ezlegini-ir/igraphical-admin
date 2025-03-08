import z from "zod";

const requiredMessage = "Required";
export const adminRoles = ["ADMIN", "AUTHOR"] as const;
export const status = ["1", "0"] as const;
export const lessonsType = ["FILE", "VIDEO", "ASSET"] as const;
export const paymentStatus = ["PENDING", "SUBMITTED", "CANCELED"] as const;
export const paymentMethod = ["zarrin_pal", "melli", "admin"] as const;
export const couponType = ["FIXED", "PERCENT"] as const;
export const ticketStatus = ["PENDING", "CLOSED", "ANSWERED"] as const;
export const ticketDepartment = [
  "TECHNICAL",
  "FINANCE",
  "COURSE",
  "SUGGEST",
] as const;
const image = z
  .instanceof(File)
  .optional()
  .refine((file) => !file || file.size <= 4 * 1024 * 1024, {
    message: "Image size must be less than 4MB",
  });

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
  url: z.string().min(1).trim(),
  image,
  content: z.string().min(1),
  categories: z.array(z.string()),
  status: z.enum(status),
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
  userId: z.number().optional(),
  postId: z.number(),
  date: z.date(),
});
export type CommentFormType = z.infer<typeof commentFormSchema>;

//! COURSES
export const courseFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().min(1, "URL is required"),
  summery: z.string().min(1, "Summary is required"),
  learns: z.array(
    z.object({ value: z.string().min(1, "Learning point is required") })
  ),
  description: z.string().min(1, "Description is required"),
  prerequisite: z.array(z.object({ value: z.string().min(1) })).optional(),
  status: z.enum(status, { required_error: "Status is required" }),
  instructor: z.string().min(1, "Instructor is required"),
  tizerUrl: z.string().min(1, "Teaser URL is required"),
  duration: z.number().min(1, "Duration must be a positive number"),
  image: z.instanceof(File, { message: "Image file is required" }).optional(),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be a non-negative number"),

  // Discount Schema
  discount: z
    .object({
      amount: z
        .number()
        .min(0, "Discount amount must be a non-negative number"),
      type: z.enum(["FIXED", "PERCENT"], {
        required_error: "Discount type is required",
      }),
      date: z
        .object({
          from: z.coerce.date({
            invalid_type_error: "Invalid date format for 'from'",
          }),
          to: z.coerce.date({
            invalid_type_error: "Invalid date format for 'to'",
          }),
        })
        .optional(),
    })
    .optional(),

  // Curriculum Schema
  curriculum: z
    .array(
      z.object({
        sectionTitle: z.string().min(1, "Section title is required"),
        lessons: z.array(
          z.object({
            title: z.string().min(1, "Lesson title is required"),
            duration: z
              .number()
              .min(0, "Lesson duration must be a non-negative number")
              .optional(),
            url: z.string(),
            isFree: z.boolean(),
            type: z.enum(lessonsType),
          })
        ),
      })
    )
    .optional(),

  // Gallery Schema
  gallery: z
    .array(
      z.instanceof(File, { message: "Each gallery item must be an image file" })
    )
    .optional(),
});
export type CourseFormType = z.infer<typeof courseFormSchema>;
// --------------
export const reviewFormSchema = z.object({
  content: z.string().min(1),
  rate: z.string(),
  user: z.string(),
  date: z.date(),
  course: z.string(),
});
export type ReviewFormType = z.infer<typeof reviewFormSchema>;

//! ANNOUNCEMENTS
export const slidersFormSchema = z.object({
  images: z.array(
    z.object({
      link: z.string().min(1).optional(),
      image: z.instanceof(File).optional(),
      active: z.boolean(),
    })
  ),
});
export type SlidersFormType = z.infer<typeof slidersFormSchema>;
// --------------
export const notifbarFormSchema = z.object({
  content: z.string().min(1),
  link: z.string().min(1),
  bgColor: z.string().min(1),
  textColor: z.string().min(1),
  active: z.boolean(),
});
export type NotifbarFormType = z.infer<typeof notifbarFormSchema>;

//! PAYMENTS
export const paymentsFormSchema = z.object({
  createdAt: z.date(),
  status: z.enum(paymentStatus),
  total: z.number().min(0),
  user: z.string().min(1),
  courses: z.array(z.object({ id: z.string() })),
  discountCode: z.string().optional(),
  paymentMethod: z.enum(paymentMethod),
});
export type PaymentsFormType = z.infer<typeof paymentsFormSchema>;

//! MARKETING
export const couponFormSchema = z.object({
  coupon: z.string(),
  type: z.enum(couponType),
  amount: z.number().min(0),
  summery: z.string(),
  limit: z.number().min(0),
  expiresAt: z.date().optional(),
});
export type CouponFormType = z.infer<typeof couponFormSchema>;
// --------------
export const overallOffFormSchema = z.object({
  amount: z.number().min(0),
  expiresAt: z.date(),
  includeCourses: z.array(z.object({ id: z.string() })),
  excludeCourses: z.array(z.object({ id: z.string() })),
});
export type OverallOffFormType = z.infer<typeof overallOffFormSchema>;

//! TICKET FORM
export const TicketFormSchema = z.object({
  subject: z.string().min(1),
  user: z.string().min(1),
  status: z.enum(ticketStatus),
  department: z.enum(ticketDepartment),
  message: z.string().min(1).optional(),
  file: z.instanceof(File).optional(),
});
export type TicketFormType = z.infer<typeof TicketFormSchema>;
// --------------
export const ticketCommentFormSchema = z.object({
  comment: z.string().min(1),
  file: z.instanceof(File).optional(),
});
export type TicketCommentFormType = z.infer<typeof ticketCommentFormSchema>;

//! STUDENT FORM
export const studentFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(11),
  nationalId: z.string().min(10).max(10).optional(),
  image,
});
export type StudentFormType = z.infer<typeof studentFormSchema>;

//! TUTOR FORM
export const tutorFormSchema = z.object({
  name: z.string().min(1),
  displayName: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  image,
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 12, {
      message: "Password must be at least 6 characters long",
    }),
});
export type TutorFormType = z.infer<typeof tutorFormSchema>;

//! ADMINS
export const adminFormSchema = z.object({
  name: z.string().min(1),
  displayName: z.string().min(1),
  role: z.enum(adminRoles),
  email: z.string().email().min(1),
  image,
  phone: z.string().min(1),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 12, {
      message: "Password must be at least 6 characters long",
    }),
});
export type AdminFormType = z.infer<typeof adminFormSchema>;
