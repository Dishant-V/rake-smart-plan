import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PickupLocation {
  id: string;
  name: string;
  type: "plant" | "warehouse";
}

interface OrderFormProps {
  materialId: string;
  materialName: string;
  basePrice: number;
  onClose: () => void;
}

const OrderForm = ({ materialId, materialName, basePrice, onClose }: OrderFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [formData, setFormData] = useState({
    quantity: "",
    deliveryLocation: "",
    deadline: "",
    pickupLocationId: "",
    pickupLocationType: "" as "plant" | "warehouse" | "",
  });

  useEffect(() => {
    loadPickupLocations();
  }, []);

  const loadPickupLocations = async () => {
    try {
      const [plantsRes, warehousesRes] = await Promise.all([
        supabase.from("plants").select("id, name"),
        supabase.from("warehouses").select("id, name"),
      ]);

      const locations: PickupLocation[] = [
        ...(plantsRes.data?.map(p => ({ id: p.id, name: p.name, type: "plant" as const })) || []),
        ...(warehousesRes.data?.map(w => ({ id: w.id, name: w.name, type: "warehouse" as const })) || []),
      ];

      setPickupLocations(locations);
    } catch (error) {
      console.error("Error loading pickup locations:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to place an order");
        navigate("/auth");
        return;
      }

      if (!formData.pickupLocationId || !formData.pickupLocationType) {
        toast.error("Please select a pickup location");
        return;
      }

      const quantity = parseFloat(formData.quantity);
      const totalCost = quantity * basePrice;
      const partialPayment = totalCost * 0.5; // 50% upfront

      const orderData: any = {
        customer_id: user.id,
        material_id: materialId,
        quantity_tons: quantity,
        delivery_location: formData.deliveryLocation,
        cost_per_ton: basePrice,
        total_cost: totalCost,
        deadline: new Date(formData.deadline).toISOString(),
        status: "new",
        payment_status: "none",
        payment_amount: 0,
        pickup_location_plant_id: formData.pickupLocationType === "plant" ? formData.pickupLocationId : null,
        pickup_location_warehouse_id: formData.pickupLocationType === "warehouse" ? formData.pickupLocationId : null,
      };

      const { data, error } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      toast.success("Order created! Proceeding to payment...");
      
      // Navigate to dummy payment page
      navigate(`/payment/${data.id}?amount=${partialPayment}`);
      onClose();
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Place Order - {materialName}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="quantity">Quantity (tons)</Label>
          <Input
            id="quantity"
            type="number"
            step="0.01"
            min="0.01"
            required
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          />
          {formData.quantity && (
            <p className="text-sm text-muted-foreground mt-1">
              Total Cost: ₹{(parseFloat(formData.quantity) * basePrice).toLocaleString()} 
              <span className="text-primary ml-2">
                (50% upfront: ₹{(parseFloat(formData.quantity) * basePrice * 0.5).toLocaleString()})
              </span>
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="pickupLocation">Pickup Location</Label>
          <Select
            value={formData.pickupLocationId}
            onValueChange={(value) => {
              const location = pickupLocations.find(l => l.id === value);
              setFormData({
                ...formData,
                pickupLocationId: value,
                pickupLocationType: location?.type || "",
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select pickup location" />
            </SelectTrigger>
            <SelectContent>
              {pickupLocations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name} ({location.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="deliveryLocation">Delivery Location</Label>
          <Input
            id="deliveryLocation"
            placeholder="Enter your delivery address"
            required
            value={formData.deliveryLocation}
            onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="deadline">Delivery Deadline</Label>
          <Input
            id="deadline"
            type="datetime-local"
            required
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-steel"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default OrderForm;
