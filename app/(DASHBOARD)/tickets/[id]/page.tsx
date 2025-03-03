import TicketForm, { TicketType } from "@/components/forms/ticket/TicketForm";

interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  return (
    <div className="space-y-3">
      <h3>Update Ticket</h3>

      <TicketForm type="UPDATE" ticket={ticket} />
    </div>
  );
};

const ticket: TicketType = {
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
};

export default page;
