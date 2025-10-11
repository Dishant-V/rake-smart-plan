import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import OrderForm from "./OrderForm";

const MaterialsList = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .order("name");

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error("Error loading materials:", error);
      toast.error("Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = (material: any) => {
    setSelectedMaterial(material);
    setOrderDialogOpen(true);
  };

  if (loading) {
    return (
      <Card className="glass-card p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (materials.length === 0) {
    return (
      <Card className="glass-card p-8 text-center">
        <p className="text-muted-foreground">
          No materials available. Contact admin to add materials.
        </p>
      </Card>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Price/Ton</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material, index) => (
                <motion.tr
                  key={material.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{material.material_code}</Badge>
                  </TableCell>
                  <TableCell>₹{material.base_price_per_ton}</TableCell>
                  <TableCell>{material.unit}</TableCell>
                  <TableCell>
                    {material.hazard_flag ? (
                      <Badge variant="destructive">Hazardous</Badge>
                    ) : (
                      <Badge variant="secondary">Standard</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="bg-gradient-steel hover:opacity-90"
                      onClick={() => handleOrder(material)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Order
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </Card>
      </motion.div>

      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Place Order</DialogTitle>
          </DialogHeader>
          {selectedMaterial && (
            <OrderForm
              materialId={selectedMaterial.id}
              materialName={selectedMaterial.name}
              basePrice={selectedMaterial.base_price_per_ton}
              onClose={() => setOrderDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MaterialsList;
