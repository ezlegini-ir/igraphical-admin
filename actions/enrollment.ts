"use server";

import { EnrollmentStatusFormType } from "@/components/forms/enrollment/EnrollmentStatusForm";
import { getCouponByCode } from "@/data/coupon";
import { getAllCoursesByIds } from "@/data/course";
import { getUserById } from "@/data/user";
import { handleError } from "@/lib/utils";
import { EnrollmentFormType } from "@/lib/validationSchema";
import prisma from "@/prisma/client";
import { Payment } from "@prisma/client";

//* CREATE -----------------------------------------------------------

export const createEnrollment = async (data: EnrollmentFormType) => {
  const { courses, enrolledAt, userId, payment } = data;

  try {
    const existingUser = await getUserById(userId);
    const existingCourses = await getAllCoursesByIds(
      courses.map((c) => c.courseId)
    );

    if (!existingCourses || !existingUser)
      return { error: "Invalid Ids for Course or User" };

    await prisma.$transaction(async (tx) => {
      // PAYMENT
      let newPayment: Payment | undefined;
      if (payment) {
        let existingCoupon;
        if (payment.discountCode) {
          existingCoupon = await getCouponByCode(payment.discountCode);

          if (!existingCoupon) throw new Error("Invalid Coupon Code");
        }

        newPayment = await tx.payment.create({
          data: {
            total: payment.total,
            discountAmount: payment.discountAmount,
            discountCode: payment.discountCode,
            itemsTotal: payment.itemsTotal,
            paymentMethod: "ADMIN",
            status: payment.status,
            couponId: existingCoupon ? existingCoupon.id : undefined,
            userId,
            paidAt: enrolledAt,
          },
        });
      }

      const courseIds = courses.map((c) => c.courseId);
      const existingEnrollments = await tx.enrollment.findMany({
        where: { userId, courseId: { in: courseIds } },
      });
      const enrolledCourseIds = existingEnrollments.map((e) => e.courseId);

      const coursesToEnroll = courses.filter(
        (course) => !enrolledCourseIds.includes(course.courseId)
      );

      if (coursesToEnroll.length !== courses.length) {
        throw new Error(
          `User is already enrolled in ${coursesToEnroll.length === 0 ? "ALL" : courses.length - coursesToEnroll.length} of selected courses.`
        );
      }

      const newEnrollment = await tx.enrollment.createMany({
        data: coursesToEnroll.map((course) => ({
          price: course.price,
          enrolledAt,
          courseId: course.courseId,
          userId,
          paymentId: newPayment?.id,
        })),
      });

      return newEnrollment;
    });

    return {
      success: payment
        ? "Payment and Enrollment Created Successfully"
        : "Enrollment Created Successfully",
    };
  } catch (error) {
    return handleError(error);
  }
};

//? UPDATE -----------------------------------------------------------

export const updateEnrollment = async (
  data: EnrollmentStatusFormType,
  id: number
) => {
  try {
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { id },
    });

    if (!existingEnrollment) return { error: "No Enerollment Found" };

    await prisma.enrollment.update({
      where: { id },
      data: {
        status: data.enrollmentStatus,
      },
    });

    return {
      success: `Enrollment Updated Successfully`,
    };
  } catch (error) {
    return { error } as { error: string };
  }
};

//! DELETE -----------------------------------------------------------

export const deleteEnrollment = async (id: number) => {
  try {
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { id },
    });

    if (!existingEnrollment) return { error: "No Enerollment Found" };

    await prisma.enrollment.delete({
      where: { id },
    });

    return {
      success: `Enrollment Deleted Successfully`,
    };
  } catch (error) {
    return handleError(error);
  }
};
