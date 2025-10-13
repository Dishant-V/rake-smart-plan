import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format } from "date-fns";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

interface Order {
  id: string;
  customer_id: string;
  material_name: string;
  quantity_tons: number;
  delivery_location: string;
  deadline: string;
  status: string;
  total_cost: number;
  created_at: string;
  customer_email: string;
}

const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    
    // Subscribe to real-time order updates
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("Order update:", payload);
          if (payload.eventType === "INSERT") {
            toast.success("New order received!");
            loadOrders(); // Reload to get complete data with joins
          } else {
            loadOrders();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadOrders = async () => {
    try {
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select(`
          id,
          customer_id,
          quantity_tons,
          delivery_location,
          deadline,
          status,
          total_cost,
          created_at,
          materials (name),
          profiles (email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted = ordersData?.map((order: any) => ({
        id: order.id,
        customer_id: order.customer_id,
        material_name: order.materials?.name || "Unknown",
        quantity_tons: order.quantity_tons,
        delivery_location: order.delivery_location,
        deadline: order.deadline,
        status: order.status,
        total_cost: order.total_cost,
        created_at: order.created_at,
        customer_email: order.profiles?.email || "Unknown",
      })) || [];

      setOrders(formatted);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus as any })
        .eq("id", orderId);

      if (error) throw error;
      toast.success(`Order status updated to ${newStatus}`);
      loadOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; icon: any }> = {
      new: { variant: "default", icon: <Package className="w-3 h-3 mr-1" /> },
      allocated: { variant: "secondary", icon: <Clock className="w-3 h-3 mr-1" /> },
      picked: { variant: "secondary", icon: <Clock className="w-3 h-3 mr-1" /> },
      dispatched: { variant: "secondary", icon: <Clock className="w-3 h-3 mr-1" /> },
      delivered: { variant: "default", icon: <CheckCircle className="w-3 h-3 mr-1" /> },
      cancelled: { variant: "destructive", icon: <XCircle className="w-3 h-3 mr-1" /> },
    };

    const config = statusConfig[status] || statusConfig.new;

    return (
      <Badge variant={config.variant} className="flex items-center w-fit">
        {config.icon}
        {status}
      </Badge>
    );
  };

  const newOrders = orders.filter((order) => order.status === "new");
  const pendingOrders = orders.filter((order) =>
    ["allocated", "picked", "dispatched"].includes(order.status)
  );
  const completedOrders = orders.filter((order) =>
    ["delivered", "cancelled"].includes(order.status)
  );

  const renderOrdersTable = (ordersList: Order[], showActions: boolean = false) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Material</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Delivery Location</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Cost</TableHead>
            {showActions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 8 : 7} className="text-center text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            ordersList.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.customer_email}</TableCell>
                <TableCell>{order.material_name}</TableCell>
                <TableCell>{order.quantity_tons} tons</TableCell>
                <TableCell>{order.delivery_location}</TableCell>
                <TableCell>{format(new Date(order.deadline), "PPP")}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>₹{order.total_cost.toLocaleString()}</TableCell>
                {showActions && (
                  <TableCell>
                    <div className="flex gap-2">
                      {order.status === "new" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, "allocated")}
                        >
                          Allocate
                        </Button>
                      )}
                      {order.status === "allocated" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, "picked")}
                        >
                          Pick
                        </Button>
                      )}
                      {order.status === "picked" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, "dispatched")}
                        >
                          Dispatch
                        </Button>
                      )}
                      {order.status === "dispatched" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, "delivered")}
                        >
                          Deliver
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  if (loading) {
    return (
      <Card className="glass-card p-6">
        <div className="text-center text-muted-foreground">Loading orders...</div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-6">Orders Management</h2>
      <Tabs defaultValue="new" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new">
            New Orders ({newOrders.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedOrders.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="new" className="mt-4">
          {renderOrdersTable(newOrders, true)}
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          {renderOrdersTable(pendingOrders, true)}
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          {renderOrdersTable(completedOrders, false)}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default OrdersManagement;
