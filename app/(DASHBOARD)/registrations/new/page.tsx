import PaymentForm from "@/components/forms/payment/PaymentForm";

const page = () => {
  return (
    <div className="space-y-3">
      <h3>Create a Payment</h3>

      <PaymentForm type="NEW" />
    </div>
  );
};

export default page;
