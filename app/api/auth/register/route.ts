import { newUserFormSchema, NewUserFormType } from "@/lib/validationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body: NewUserFormType = await req.json();
  const { email, firstName, lastName, nationalId, phone } = body;

  try {
    //  FORM VALIDATION
    const validation = newUserFormSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json({ error: "Form Inputs Not Valid" });

    // USER LOOKUP
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { nationalId }, { phone }],
      },
    });

    if (existingUser && existingUser.email === email)
      return NextResponse.json(
        { error: "با این ایمیل کاربری از قبل وجود دارد." },
        { status: 400 }
      );
    if (existingUser && existingUser.phone === phone)
      return NextResponse.json(
        { error: "با این شماره تماس کاربری از قبل وجود دارد." },
        { status: 400 }
      );
    if (existingUser && existingUser.nationalId === nationalId)
      return NextResponse.json(
        { error: "با این کد ملی کاربری از قبل وجود دارد." },
        { status: 400 }
      );

    // CREATE USER
    await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        nationalId,
        phone,
      },
    });

    return NextResponse.json(
      { success: "User Created Successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Something Happened" }, { status: 500 });
  }
}
