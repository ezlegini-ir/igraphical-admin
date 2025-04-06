"use server";

import { paidSettlmentSmsText } from "@/data/sms";
import { sendSms } from "@/lib/sms";
import { SettlementFormType } from "@/lib/validationSchema";
import { prisma } from "@igraphical/core";

export const createSettlement = async (data: SettlementFormType) => {
  const { date } = data;
  const tutorId = +data.tutorId;

  try {
    const existingTutor = await prisma.tutor.findFirst({
      where: { id: +tutorId },
    });
    if (!existingTutor) throw new Error("No Tutor Found");

    // CALCULATIONS
    const enrollments = await prisma.enrollment.groupBy({
      by: ["enrolledAt"],
      where: {
        course: {
          tutorId,
        },
        enrolledAt: {
          gte: date.from,
          lte: date.to,
        },
      },
      _sum: { price: true },
    });

    const totalSell = enrollments.reduce(
      (acc, curr) => acc + (curr._sum.price || 0),
      0
    );
    const profitFactor = existingTutor.profit / 100;
    const amount = totalSell * profitFactor;

    // CREATE SETTLEMENT
    await prisma.settlement.create({
      data: {
        amount,
        from: date.from,
        to: date.to,
        profit: existingTutor.profit,
        status: "PENDING",
        totalEnrollments: 2,
        totalSell: totalSell,
        tutorId,
        paidAt: null,
      },
    });

    return { success: "Settle Created Succesfully" };
  } catch (error) {
    return { error: String(error) };
  }
};

export const updateSettlement = async (
  data: SettlementFormType,
  settlementId: number
) => {
  const { status } = data;
  try {
    const existingSettlement = await prisma.settlement.findFirst({
      where: { id: settlementId },
      include: {
        tutor: true,
      },
    });

    if (!existingSettlement) throw new Error("No Settlement Found");

    await prisma.settlement.update({
      where: { id: settlementId },
      data: {
        status,
        paidAt: status === "PENDING" ? null : new Date(),
      },
    });

    if (status === "PAID")
      sendSms({
        message: paidSettlmentSmsText(
          existingSettlement.tutor.displayName,
          existingSettlement.amount
        ),
        receptor: existingSettlement.tutor.phone,
      });

    return { success: "Status of Settlement Updated Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};

export const deleteSettlement = async (settlementId: number) => {
  try {
    const existingSettlement = await prisma.settlement.findFirst({
      where: { id: settlementId },
    });
    if (!existingSettlement) throw new Error("No Settlement Found");

    await prisma.settlement.delete({
      where: { id: settlementId },
    });

    return { success: "Settlement Deleted Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};
