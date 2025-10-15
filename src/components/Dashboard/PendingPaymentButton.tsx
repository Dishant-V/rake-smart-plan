import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PendingPaymentButtonProps {
  orderId: string;
  amount: number;
  paymentStatus: string;
}

const PendingPaymentButton = ({
  orderId,
  amount,
  paymentStatus,
}: PendingPaymentButtonProps) => {
  const navigate = useNavigate();

  if (paymentStatus === "paid") return null;

  const handlePayment = () => {
    navigate(`/payment?orderId=${orderId}&amount=${amount}`);
  };

  return (
    <Button
      size="sm"
      variant="default"
      onClick={handlePayment}
      className="bg-gradient-steel hover:opacity-90"
    >
      <CreditCard className="mr-2 h-4 w-4" />
      {paymentStatus === "partial" ? "Complete Payment" : "Pay Now"}
    </Button>
  );
};

export default PendingPaymentButton;
