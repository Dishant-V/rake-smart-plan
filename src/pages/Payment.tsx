import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, CreditCard, CheckCircle } from "lucide-react";
import Header from "@/components/Layout/Header";
import { motion } from "framer-motion";

const Payment = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const amount = parseFloat(searchParams.get("amount") || "0");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        const { error } = await supabase
          .from("orders")
          .update({
            payment_status: "partial",
            payment_amount: amount,
            payment_txn_id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          })
          .eq("id", orderId);

        if (error) throw error;

        setSuccess(true);
        toast.success("Payment successful! Order confirmed.");
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (error: any) {
        console.error("Payment error:", error);
        toast.error("Payment failed. Please try again.");
        setProcessing(false);
      }
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <Card className="glass-card p-8">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground mb-4">
                Your order has been confirmed and payment received.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to dashboard...
              </p>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card className="glass-card p-8">
            <div className="text-center mb-6">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h1 className="text-3xl font-bold mb-2">Payment</h1>
              <p className="text-muted-foreground">Complete your order payment</p>
            </div>

            <div className="space-y-6">
              <div className="bg-background/50 rounded-lg p-4 border border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono text-sm">{orderId?.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Payment Type:</span>
                  <span className="font-medium">50% Upfront</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t border-border pt-2 mt-2">
                  <span>Amount Due:</span>
                  <span className="text-primary">₹{amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="mb-2">
                  <strong>Note:</strong> This is a demo payment page.
                </p>
                <p>
                  In production, this would integrate with a real payment gateway (Stripe, Razorpay, etc.).
                </p>
              </div>

              <Button
                className="w-full bg-gradient-steel h-12 text-lg"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pay ₹{amount.toLocaleString()}
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/dashboard")}
                disabled={processing}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Payment;
