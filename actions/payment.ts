"use server";

import { EnrollmentStatusFormType } from "@/components/forms/payment/EnrollmentStatusForm";
import { getCouponByCode } from "@/data/coupon";
import { getAllCoursesByIds } from "@/data/course";
import { getPaymentById } from "@/data/payment";
import { getUserById } from "@/data/user";
import { handleError } from "@/lib/utils";
import { EnrollmentFormType as PaymentFormType } from "@/lib/validationSchema";
import prisma from "@/prisma/client";

//* CREATE -----------------------------------------------------------

export const createPayment = async (data: PaymentFormType) => {
  const { courses, enrolledAt, userId, payment } = data;

  try {
    const existingUser = await getUserById(userId);
    const existingCourses = await getAllCoursesByIds(
      courses.map((c) => c.courseId)
    );

    if (!existingCourses || !existingUser)
      return { error: "Invalid Ids for Course or User" };

    const newPayment = await prisma.$transaction(async (tx) => {
      // PAYMENT
      let existingCoupon;
      if (payment?.discountCode) {
        existingCoupon = await getCouponByCode(payment.discountCode);

        if (!existingCoupon) throw new Error("Invalid Coupon Code");
      }

      const newerPayment = await tx.payment.create({
        data: {
          total: payment.total,
          discountAmount: payment?.discountAmount,
          discountCode: payment?.discountCode,
          discountCodeAmount: payment?.discountCodeAmount,
          itemsTotal: payment?.itemsTotal,
          paymentMethod: "ADMIN",
          status: payment?.status,
          couponId: existingCoupon ? existingCoupon.id : undefined,
          userId,
          paidAt: enrolledAt,
        },
      });

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
          `User is already enrolled in ${
            courses.length - coursesToEnroll.length
          } of the selected courses.`
        );
      }

      for (const course of coursesToEnroll) {
        const enrollment = await tx.enrollment.create({
          data: {
            enrolledAt,
            courseId: course.courseId,
            userId,
            paymentId: newerPayment.id,
            price: course.price,
            courseOriginalPrice: course.originalPrice,
          },
        });

        await tx.classRoom.create({
          data: {
            userId,
            enrollmentId: enrollment.id,
          },
        });
      }

      return newerPayment;
    });

    return {
      success:
        payment && payment.total !== 0
          ? "Payment, Enrollment, and Classroom Created Successfully"
          : "Enrollment and Classroom Created Successfully",
      payment: newPayment?.id,
    };
  } catch (error) {
    return { error: String(error) };
  }
};

//? UPDATE -----------------------------------------------------------

export const updateEnrollmentStatus = async (
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

//? Update ----------------------

export const updatePayment = async (data: PaymentFormType, id: number) => {
  const { enrolledAt, payment } = data;

  try {
    const existingPayment = await getPaymentById(id);

    if (!existingPayment) return { error: "Payment Not Found" };

    await prisma.payment.update({
      where: { id },
      data: {
        paidAt: enrolledAt,
        status: payment?.status,
      },
    });

    return { success: "Payment Updated Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};

//! DELETE -----------------------------------------------------------

export const deleteEnrollment = async (id: number) => {
  try {
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        payment: true,
      },
    });

    if (!existingEnrollment) return { error: "No Enrollment Found" };

    const paymentId = existingEnrollment.payment?.id;

    await prisma.enrollment.delete({ where: { id } });

    if (paymentId) {
      const remainingEnrollments = await prisma.enrollment.count({
        where: { paymentId },
      });

      if (remainingEnrollments === 0) {
        await prisma.payment.delete({ where: { id: paymentId } });
      }
    }

    return { success: "Enrollment Deleted Successfully" };
  } catch (error) {
    return handleError(error);
  }
};

export const deletePayment = async (id: number) => {
  try {
    const existingPayment = await getPaymentById(id);

    if (!existingPayment) return { error: "Payment Not Found" };

    await prisma.payment.delete({
      where: { id },
    });

    return { success: "Payment Deleted Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};
