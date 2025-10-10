import Header from "@/components/Layout/Header";
import MaterialsList from "@/components/Dashboard/MaterialsList";
import { Package } from "lucide-react";

const Materials = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center">
            <Package className="mr-3 h-10 w-10 text-primary" />
            Available Materials
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse our catalog of steel materials and place orders
          </p>
        </div>
        <MaterialsList />
      </main>
    </div>
  );
};

export default Materials;
