import React from "react";
import TicketList from "./TicketList";
import { TicketType } from "@/components/forms/ticket/TicketForm";
import Filter from "@/components/Filter";
import NewButton from "@/components/NewButton";

const page = () => {
  const totalTickets = 20;
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>Tickets</h3>
        <div className="flex gap-3 justify-between items-center">
          <Filter
            defaultValue="all"
            placeholder="All Statuses"
            name="status"
            options={[
              { label: "All Statuses", value: "all" },
              { label: "Closed", value: "closed" },
              { label: "Pending", value: "pending" },
              { label: "Answered", value: "answered" },
            ]}
          />

          <Filter
            defaultValue="all"
            placeholder="All Departments"
            name="department"
            options={[
              { label: "All Departments", value: "all" },
              { label: "Technical", value: "technical" },
              { label: "Finance", value: "finance" },
              { label: "Course", value: "course" },
              { label: "Suggest", value: "suggest" },
            ]}
          />

          <NewButton href="/tickets/new" title="New Ticket" />
        </div>
      </div>

      <TicketList tickets={tickets} totalTickets={totalTickets} />
    </div>
  );
};

const tickets: TicketType[] = [
  {
    id: 1,
    subject: "یک مشکل بزرگ رخ داده است. به خدا",
    status: "PENDING",
    createdAt: new Date("2024-02-14T10:30:00.000Z"),
    updatedAt: new Date("2024-02-14T12:45:00.000Z"),
    department: "TECHNICAL",
    user: {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "09127452859",
    },
    comments: [
      {
        id: 3,
        ticketId: 1,
        type: "ADMIN",
        user: {
          id: 7,
          name: "آی‌گرافیکال",
        },
        message:
          "با سلام و وقت بخیر. برای مشاهده دوره میتونید به حساب کاربری، دوره ها سلام و وقت بخیر. برای اب کاربری، دوره ها سلام و وقت بخیر. برای مشاهده دوره میتونید به حساب کاربری، دوره ها سلام و وقت بخیر. برای مشاهده دوره میتونید به حساب کاربری، دوره ها مراجعه کنید.",
        createdAt: new Date("2024-02-14T11:00:00.000Z"),
        attachment: {
          id: 5,
          fileUrl: "/uploads/screenshot1.png",
        },
      },

      {
        id: 4,
        ticketId: 1,
        type: "STUDENT",
        user: {
          id: 7,
          name: "محمد امین برهانی ایران",
        },
        message: "خیلی مممنونمممم ازت.",
        createdAt: new Date("2024-02-14T11:00:00.000Z"),
      },

      {
        id: 3,
        ticketId: 1,
        type: "ADMIN",
        user: {
          id: 7,
          name: "آی‌گرافیکال",
        },
        message:
          "با سلام و وقت بخیر. برای مشاهده دوره میتونید به حساب کاربری، دوره ها مراجعه کنید.",
        createdAt: new Date("2024-02-14T11:00:00.000Z"),
        attachment: {
          id: 5,
          fileUrl: "/uploads/screenshot1.png",
        },
      },

      {
        id: 4,
        ticketId: 1,
        type: "STUDENT",
        user: {
          id: 7,
          name: "محمد امین برهانی ایران",
        },
        message:
          "با سلام و وقت بخیر. برای مشاهده دوره میتونید به حساب کاربری، دوره ها مراجعه کنید.",
        createdAt: new Date("2024-02-14T11:00:00.000Z"),
      },
    ],
  },
  {
    id: 1,
    subject: "یک مشکل بزرگ رخ داده است. به خدا",
    status: "ANSWERED",
    createdAt: new Date("2024-02-14T10:30:00.000Z"),
    updatedAt: new Date("2024-02-14T12:45:00.000Z"),
    department: "FINANCE",
    user: {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "09127452859",
    },
    comments: [
      {
        id: 3,
        ticketId: 1,
        type: "ADMIN",
        user: {
          id: 7,
          name: "آی‌گرافیکال",
        },
        message:
          "با سلام و وقت بخیر. برای مشاهده دوره میتونید به حساب کاربری، دوره ها سلام و وقت بخیر. برای اب کاربری، دوره ها سلام و وقت بخیر. برای مشاهده دوره میتونید به حساب کاربری، دوره ها سلام و وقت بخیر. برای مشاهده دوره میتونید به حساب کاربری، دوره ها مراجعه کنید.",
        createdAt: new Date("2024-02-14T11:00:00.000Z"),
        attachment: {
          id: 5,
          fileUrl: "/uploads/screenshot1.png",
        },
      },
    ],
  },
  {
    id: 1,
    subject: "یک مشکل بزرگ رخ داده است. به خدا",
    status: "CLOSED",
    createdAt: new Date("2024-02-14T10:30:00.000Z"),
    updatedAt: new Date("2024-02-14T12:45:00.000Z"),
    department: "SUGGEST",
    user: {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "09127452859",
    },
    comments: [
      {
        id: 3,
        ticketId: 1,
        type: "ADMIN",
        user: {
          id: 7,
          name: "آی‌گرافیکال",
        },
        message:
          "با سلام و وقت بخیر. برای مشاهده دوره میتونید به حساب کاربری، دوره ها مراجعه کنید.",
        createdAt: new Date("2024-02-14T11:00:00.000Z"),
        attachment: {
          id: 5,
          fileUrl: "/uploads/screenshot1.png",
        },
      },
    ],
  },
];

export default page;
