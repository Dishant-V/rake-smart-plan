import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import PendingPaymentButton from "./PendingPaymentButton";

interface OrdersListProps {
  userId: string;
}

const OrdersList = ({ userId }: OrdersListProps) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [userId]);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          materials (name)
        `
        )
        .eq("customer_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-blue-500",
      allocated: "bg-yellow-500",
      picked: "bg-orange-500",
      dispatched: "bg-purple-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      none: "bg-gray-500",
      partial: "bg-yellow-500",
      paid: "bg-green-500",
      refunded: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  if (loading) {
    return (
      <Card className="glass-card p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="glass-card p-8 text-center">
        <p className="text-muted-foreground">
          No orders yet. Start by ordering materials from the list above.
        </p>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {order.materials?.name || "N/A"}
              </TableCell>
              <TableCell>{order.quantity_tons} tons</TableCell>
              <TableCell>₹{order.total_cost.toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={getPaymentStatusColor(order.payment_status)}
                >
                  {order.payment_status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(order.deadline), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                <PendingPaymentButton
                  orderId={order.id}
                  amount={order.total_cost - (order.payment_amount || 0)}
                  paymentStatus={order.payment_status}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default OrdersList;
