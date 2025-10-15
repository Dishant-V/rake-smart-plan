import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Truck, DollarSign, Package } from "lucide-react";

interface Prediction {
  orderId: string;
  materialName: string;
  quantity: number;
  deliveryLocation: string;
  pickupLocation: string;
  route: string;
  wagonAssignment: Array<{ type: string; count: number }>;
  estimatedDeliveryDate: string;
  estimatedDeliveryDays: number;
  totalCost: number;
  costBreakdown: {
    material: number;
    transport: number;
    handling: number;
  };
}

interface RakePredictionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  predictions: Prediction[];
}

const RakePredictionDialog = ({
  open,
  onOpenChange,
  predictions,
}: RakePredictionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Rake Optimization Results</DialogTitle>
          <DialogDescription>
            AI-powered analysis of {predictions.length} order(s) with optimized routing and wagon assignment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {predictions.map((prediction, index) => (
            <Card key={index} className="p-6 glass-card">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{prediction.materialName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Order: {prediction.orderId.substring(0, 8)}...
                    </p>
                  </div>
                  <Badge variant="default" className="text-base px-3 py-1">
                    {prediction.quantity} tons
                  </Badge>
                </div>

                <Separator />

                {/* Location Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">Pickup Location:</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                      {prediction.pickupLocation}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span className="font-medium">Delivery Location:</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                      {prediction.deliveryLocation}
                    </p>
                  </div>
                </div>

                {/* Route */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-primary" />
                    <span className="font-medium">Optimized Route:</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{prediction.route}</p>
                </div>

                {/* Wagon Assignment */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-medium">Wagon Assignment:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-6">
                    {prediction.wagonAssignment.map((wagon, idx) => (
                      <Badge key={idx} variant="secondary">
                        {wagon.count}x {wagon.type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Delivery Estimate */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">Estimated Delivery:</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    {prediction.estimatedDeliveryDate} ({prediction.estimatedDeliveryDays} days)
                  </p>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="font-medium">Cost Breakdown:</span>
                  </div>
                  <div className="pl-6 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Material Cost:</span>
                      <span className="font-medium">₹{prediction.costBreakdown.material.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transport Cost:</span>
                      <span className="font-medium">₹{prediction.costBreakdown.transport.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Handling Cost:</span>
                      <span className="font-medium">₹{prediction.costBreakdown.handling.toLocaleString()}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total Cost:</span>
                      <span className="text-primary">₹{prediction.totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RakePredictionDialog;
