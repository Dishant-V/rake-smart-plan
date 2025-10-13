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
import { Skeleton } from "@/components/ui/skeleton";

interface InventoryItem {
  id: string;
  location_name: string;
  location_type: string;
  material_name: string;
  available_tons: number;
}

const InventoryTables = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const { data: inventoryData, error } = await supabase
        .from("inventory")
        .select(`
          id,
          available_tons,
          material_id,
          plant_id,
          warehouse_id,
          materials (name),
          plants (name),
          warehouses (name)
        `);

      if (error) throw error;

      const formatted = inventoryData?.map((item: any) => ({
        id: item.id,
        location_name: item.plants?.name || item.warehouses?.name || "Unknown",
        location_type: item.plant_id ? "Plant" : "Warehouse",
        material_name: item.materials?.name || "Unknown",
        available_tons: item.available_tons,
      })) || [];

      setInventory(formatted);
    } catch (error) {
      console.error("Error loading inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const plantInventory = inventory.filter((item) => item.location_type === "Plant");
  const warehouseInventory = inventory.filter((item) => item.location_type === "Warehouse");

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="glass-card p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plants Inventory */}
      <Card className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">Plant Inventory</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plant Name</TableHead>
                <TableHead>Material</TableHead>
                <TableHead className="text-right">Available (Tons)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plantInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No plant inventory data available
                  </TableCell>
                </TableRow>
              ) : (
                plantInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.location_name}</TableCell>
                    <TableCell>{item.material_name}</TableCell>
                    <TableCell className="text-right">{item.available_tons}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Warehouses Inventory */}
      <Card className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">Warehouse Inventory</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Warehouse Name</TableHead>
                <TableHead>Material</TableHead>
                <TableHead className="text-right">Available (Tons)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouseInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No warehouse inventory data available
                  </TableCell>
                </TableRow>
              ) : (
                warehouseInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.location_name}</TableCell>
                    <TableCell>{item.material_name}</TableCell>
                    <TableCell className="text-right">{item.available_tons}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default InventoryTables;
