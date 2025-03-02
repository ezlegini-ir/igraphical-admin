import PaymentForm, { Payment } from "@/components/forms/payment/PaymentForm";

interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  // const { id } = await params;

  return (
    <div className="space-y-3">
      <h3>Update Payment</h3>

      <PaymentForm type="UPDATE" payment={payment} />
    </div>
  );
};

export default page;

const payment: Payment = {
  id: 1,
  courses: [{ id: "2" }, { id: "3" }],
  createdAt: new Date("2025-01-03"),
  paymentMethod: "melli",
  status: "SUBMITTED",
  total: 1200000,
  transactionId: "akjnsdalk22",
  user: "1",
  discountCode: "igraphical",
};
