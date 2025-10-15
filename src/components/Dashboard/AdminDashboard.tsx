import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Factory,
  Warehouse,
  Package,
} from "lucide-react";
import InventoryTables from "./InventoryTables";
import OrdersManagement from "./OrdersManagement";
import RakeInfo from "./RakeInfo";
import WeatherForecast from "./WeatherForecast";

interface AdminDashboardProps {
  userId: string;
}

const AdminDashboard = ({ userId }: AdminDashboardProps) => {
  const [stats, setStats] = useState({
    plants: 0,
    warehouses: 0,
    materials: 0,
    newOrders: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [plants, warehouses, materials, newOrders, pendingOrders] =
        await Promise.all([
          supabase.from("plants").select("id", { count: "exact" }),
          supabase.from("warehouses").select("id", { count: "exact" }),
          supabase.from("materials").select("id", { count: "exact" }),
          supabase
            .from("orders")
            .select("id", { count: "exact" })
            .eq("status", "new"),
          supabase
            .from("orders")
            .select("id", { count: "exact" })
            .in("status", ["allocated", "picked", "dispatched"]),
        ]);

      setStats({
        plants: plants.count || 0,
        warehouses: warehouses.count || 0,
        materials: materials.count || 0,
        newOrders: newOrders.count || 0,
        pendingOrders: pendingOrders.count || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };


  const statCards = [
    {
      icon: <Factory className="h-8 w-8 text-primary" />,
      label: "Plants",
      value: stats.plants,
    },
    {
      icon: <Warehouse className="h-8 w-8 text-accent" />,
      label: "Warehouses",
      value: stats.warehouses,
    },
    {
      icon: <Package className="h-8 w-8 text-primary" />,
      label: "Materials",
      value: stats.materials,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage inventory, orders, and run AI-powered rake predictions
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
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

      {/* Orders Management - Primary Section */}
      <OrdersManagement />

      {/* Rake Info and Weather Forecast */}
      <div className="grid md:grid-cols-2 gap-6">
        <RakeInfo />
        <WeatherForecast />
      </div>

      {/* Inventory Tables */}
      <InventoryTables />
    </div>
  );
};

export default AdminDashboard;
