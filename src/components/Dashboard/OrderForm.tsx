import { useState } from "react";
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

interface OrderFormProps {
  materialId: string;
  materialName: string;
  basePrice: number;
  onClose: () => void;
}

const OrderForm = ({ materialId, materialName, basePrice, onClose }: OrderFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    quantity: "",
    pickupType: "plant",
    pickupLocation: "",
    deliveryLocation: "",
    deadline: "",
  });

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
      };

      if (formData.pickupType === "plant") {
        orderData.pickup_location_plant_id = formData.pickupLocation;
      } else {
        orderData.pickup_location_warehouse_id = formData.pickupLocation;
      }

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
          <Label htmlFor="pickupType">Pickup From</Label>
          <Select
            value={formData.pickupType}
            onValueChange={(value) => setFormData({ ...formData, pickupType: value, pickupLocation: "" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plant">Plant</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="pickupLocation">
            {formData.pickupType === "plant" ? "Select Plant" : "Select Warehouse"}
          </Label>
          <Input
            id="pickupLocation"
            placeholder={`Enter ${formData.pickupType} ID or name`}
            required
            value={formData.pickupLocation}
            onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="deliveryLocation">Delivery Location</Label>
          <Input
            id="deliveryLocation"
            placeholder="Enter delivery address"
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
