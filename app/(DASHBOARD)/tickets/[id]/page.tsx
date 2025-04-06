import TicketForm from "@/components/forms/ticket/TicketForm";
import { prisma } from "@igraphical/core";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id: +id },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        include: {
          attachment: true,
          user: {
            include: {
              image: true,
            },
          },
        },
      },
      user: {
        include: {
          image: true,
        },
      },
    },
  });

  if (!ticket) return notFound();

  return (
    <div className="space-y-3">
      <h3>Update Ticket</h3>

      <TicketForm type="UPDATE" ticket={ticket} />
    </div>
  );
};

export default page;
