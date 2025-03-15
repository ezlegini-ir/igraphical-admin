"use server";

import { CouponFormType } from "@/lib/validationSchema";
import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";

//* CREATE ------------------------------------------------------

export const createCoupon = async (data: CouponFormType) => {
  const {
    amount,
    code,
    limit,
    summery,
    type,
    date,
    courseInclude,
    courseExclude,
  } = data;

  try {
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (existingCoupon) return { error: "Coupon Code Must Be Unique." };

    // Validate course IDs exist
    const validCourseInclude = courseInclude?.length
      ? await prisma.course.findMany({
          where: { id: { in: courseInclude.map((c) => c.id) } },
          select: { id: true },
        })
      : [];

    const validCourseExclude = courseExclude?.length
      ? await prisma.course.findMany({
          where: { id: { in: courseExclude.map((c) => c.id) } },
          select: { id: true },
        })
      : [];

    await prisma.coupon.create({
      data: {
        amount,
        code,
        type,
        from: date?.from,
        to: date?.to,
        limit,
        summery,
        ...(validCourseInclude.length && {
          courseInclude: {
            connect: validCourseInclude.map((c) => ({ id: c.id })),
          },
        }),
        ...(validCourseExclude.length && {
          courseExclude: {
            connect: validCourseExclude.map((c) => ({ id: c.id })),
          },
        }),
      },
    });

    return { success: "Coupon Created Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};

//? UPDATE ------------------------------------------------------

export const updateCoupon = async (data: CouponFormType, id: number) => {
  const {
    amount,
    code,
    limit,
    summery,
    type,
    date,
    courseInclude,
    courseExclude,
  } = data;

  try {
    const existingCoupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        courseInclude: { select: { id: true } },
        courseExclude: { select: { id: true } },
      },
    });

    if (!existingCoupon) return { error: "Coupon Not Found." };

    const existingCouponByCode = await prisma.coupon.findUnique({
      where: { code },
    });

    if (existingCouponByCode && existingCouponByCode.id !== id)
      return { error: "Coupon Code Must Be Unique." };

    // Get the current course IDs from DB
    const currentIncludeIds = existingCoupon.courseInclude.map((c) => c.id);
    const currentExcludeIds = existingCoupon.courseExclude.map((c) => c.id);

    // Get new course IDs (ensure they are arrays)
    const newIncludeIds = courseInclude?.map((c) => c.id) || [];
    const newExcludeIds = courseExclude?.map((c) => c.id) || [];

    // Compute which courses to connect (add) and disconnect (remove)
    const includeToConnect = newIncludeIds.filter(
      (id) => !currentIncludeIds.includes(id)
    );
    const includeToDisconnect = currentIncludeIds.filter(
      (id) => !newIncludeIds.includes(id)
    );

    const excludeToConnect = newExcludeIds.filter(
      (id) => !currentExcludeIds.includes(id)
    );
    const excludeToDisconnect = currentExcludeIds.filter(
      (id) => !newExcludeIds.includes(id)
    );

    // Prepare update data dynamically
    const updateData: Prisma.CouponUpdateInput = {
      amount,
      code,
      type,
      from: date?.from,
      to: date?.to,
      limit,
      summery,
    };

    // Only include courseInclude if needed
    if (courseInclude !== undefined) {
      updateData.courseInclude = {
        ...(includeToConnect.length > 0 && {
          connect: includeToConnect.map((id) => ({ id })),
        }),
        ...(includeToDisconnect.length > 0 && {
          disconnect: includeToDisconnect.map((id) => ({ id })),
        }),
      };
    }

    // Only include courseExclude if needed
    if (courseExclude !== undefined) {
      updateData.courseExclude = {
        ...(excludeToConnect.length > 0 && {
          connect: excludeToConnect.map((id) => ({ id })),
        }),
        ...(excludeToDisconnect.length > 0 && {
          disconnect: excludeToDisconnect.map((id) => ({ id })),
        }),
      };
    }

    await prisma.coupon.update({
      where: { id },
      data: updateData,
    });

    return { success: "Coupon Updated Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};

//! DELETE ------------------------------------------------------

export const deleteCoupon = async (id: number) => {
  try {
    const existingCoupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!existingCoupon) return { error: "Coupon Not Found" };

    await prisma.coupon.delete({
      where: { id },
    });

    return { success: "Coupon Deleted Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};
