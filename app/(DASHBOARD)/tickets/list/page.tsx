import React from "react";
import TicketList from "./TicketList";
import Filter from "@/components/Filter";
import NewButton from "@/components/NewButton";
import { globalPageSize, pagination } from "@/data/pagination";
import { prisma } from "@igraphical/core";
import { Prisma, TicketDepartment, TicketStatus } from "@prisma/client";
import { ticketDepartment, ticketStatus } from "@/lib/validationSchema";
import Search from "@/components/Search";

interface Props {
  searchParams: Promise<{
    page: string;
    status: TicketStatus;
    department: TicketDepartment;
    search: string;
  }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, department, status, search } = await searchParams;

  const where: Prisma.TicketWhereInput = {
    department: department || undefined,
    status: status || undefined,
    user: search
      ? {
          OR: [
            { fullName: { contains: search } },
            { phone: { contains: search } },
            { nationalId: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : undefined,
  };

  const { skip, take } = pagination(page);
  const tickets = await prisma.ticket.findMany({
    where,
    include: {
      messages: {
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
    orderBy: { id: "desc" },

    skip,
    take,
  });
  const totalTickets = await prisma.ticket.count({ where });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>{totalTickets} Tickets</h3>
        <div className="flex gap-3 justify-between items-center">
          <Search placeholder="Search Users..." />

          <Filter
            placeholder="All Statuses"
            name="status"
            options={ticketStatus.map((item) => ({ label: item, value: item }))}
          />

          <Filter
            placeholder="All Departments"
            name="department"
            options={ticketDepartment.map((item) => ({
              label: item,
              value: item,
            }))}
          />

          <NewButton href="/tickets/new" title="New Ticket" />
        </div>
      </div>

      <TicketList
        tickets={tickets}
        totalTickets={totalTickets}
        pageSize={globalPageSize}
      />
    </div>
  );
};

export default page;
