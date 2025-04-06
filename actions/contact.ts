"use server";

import { getSessionUser } from "@/data/user";
import { sendEmail } from "@/lib/mail";
import { prisma } from "@igraphical/core";
import { ContactStatus } from "@prisma/client";

//* SEND ------------------------------------------------
export const sendContactResponse = async (options: {
  message: string;
  email: string;
  contactId: number;
}) => {
  const { contactId, email, message } = options;
  const respondentId = (await getSessionUser())?.id;
  if (!respondentId) return { error: "Admin Id is missing." };

  try {
    await prisma.contact.update({
      where: { id: contactId },
      data: {
        status: "REPLIED",
        ContactResponse: {
          create: {
            message,
            respondentId,
          },
        },
      },
    });

    const html = `<pre>${message}</pre>`;
    const emailRes = await sendEmail({
      to: email,
      subject: "پاسخ به پیام",
      html,
    });

    if (emailRes.error) {
      return { error: "Could not send Email..." };
    }

    return { success: "Response Message Sent Successfully." };
  } catch (error) {
    return { error: String(error) };
  }
};

//? UPDATE ------------------------------------------------

export const updateContact = async (options: {
  status: ContactStatus;
  contactId: number;
}) => {
  const { contactId, status } = options;

  try {
    await prisma.contact.update({
      where: { id: contactId },
      data: {
        status,
      },
    });

    return { success: "Updated Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};

//! DELETE ------------------------------------------------

export const deleteContact = async (contactId: number) => {
  try {
    await prisma.contact.delete({
      where: { id: contactId },
    });

    return { success: "Deleted Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};
