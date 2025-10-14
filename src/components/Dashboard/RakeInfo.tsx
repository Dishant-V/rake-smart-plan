import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Train, Factory, Warehouse } from "lucide-react";
import { motion } from "framer-motion";

interface RakeData {
  id: string;
  rake_number: string;
  min_rake_size_tons: number;
  max_rake_size_tons: number;
  wagon_count: number;
}

const RakeInfo = () => {
  const [rakes, setRakes] = useState<RakeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRakeData();
  }, []);

  const loadRakeData = async () => {
    try {
      const { data, error } = await supabase
        .from("rakes")
        .select(`
          id,
          rake_number,
          min_rake_size_tons,
          max_rake_size_tons,
          rake_wagons(wagon_id)
        `);

      if (error) throw error;

      const rakesWithCount = data?.map((rake: any) => ({
        id: rake.id,
        rake_number: rake.rake_number,
        min_rake_size_tons: rake.min_rake_size_tons,
        max_rake_size_tons: rake.max_rake_size_tons,
        wagon_count: rake.rake_wagons?.length || 0,
      })) || [];

      setRakes(rakesWithCount);
    } catch (error) {
      console.error("Error loading rake data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Train className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Rake Information</h2>
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Train className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Rake Information</h2>
      </div>

      <div className="space-y-4">
        {rakes.map((rake, index) => (
          <motion.div
            key={rake.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border border-border/50 rounded-lg p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Train className="h-5 w-5 text-primary" />
                {rake.rake_number}
              </h3>
              <Badge variant="outline" className="bg-primary/10">
                {rake.wagon_count} wagons
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Min Capacity</p>
                <p className="font-semibold">{rake.min_rake_size_tons.toLocaleString()} tons</p>
              </div>
              <div>
                <p className="text-muted-foreground">Max Capacity</p>
                <p className="font-semibold">{rake.max_rake_size_tons.toLocaleString()} tons</p>
              </div>
            </div>
          </motion.div>
        ))}

        {rakes.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No rake data available
          </p>
        )}
      </div>
    </Card>
  );
};

export default RakeInfo;
