import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingCart,
  Clock,
  CheckCircle2,
} from "lucide-react";
import MaterialsList from "./MaterialsList";
import OrdersList from "./OrdersList";

interface CustomerDashboardProps {
  userId: string;
}

const CustomerDashboard = ({ userId }: CustomerDashboardProps) => {
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
  });

  useEffect(() => {
    loadOrderStats();
  }, [userId]);

  const loadOrderStats = async () => {
    const { data: orders } = await supabase
      .from("orders")
      .select("status")
      .eq("customer_id", userId);

    if (orders) {
      setOrderStats({
        total: orders.length,
        pending: orders.filter(
          (o) => o.status === "new" || o.status === "allocated"
        ).length,
        delivered: orders.filter((o) => o.status === "delivered").length,
      });
    }
  };

  const stats = [
    {
      icon: <ShoppingCart className="h-8 w-8 text-primary" />,
      label: "Total Orders",
      value: orderStats.total,
    },
    {
      icon: <Clock className="h-8 w-8 text-accent" />,
      label: "Pending",
      value: orderStats.pending,
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
      label: "Delivered",
      value: orderStats.delivered,
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <motion.div
          className="absolute top-20 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="space-y-8 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Customer Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your orders and browse available materials
            </p>
          </div>
        </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-card glass-hover p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                {stat.icon}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

        {/* Materials Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <Package className="mr-2 h-6 w-6 text-primary" />
              Available Materials
            </h2>
          </div>
          <MaterialsList />
        </motion.div>

        {/* Orders Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
          <OrdersList userId={userId} />
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
