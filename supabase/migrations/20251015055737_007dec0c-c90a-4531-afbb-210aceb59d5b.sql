-- Drop the existing check constraint that requires pickup location
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_pickup_check;

-- Add a new check constraint that allows both to be null (ML will optimize later)
ALTER TABLE public.orders ADD CONSTRAINT orders_pickup_check
  CHECK (
    (pickup_location_plant_id IS NULL AND pickup_location_warehouse_id IS NULL) OR
    (pickup_location_plant_id IS NOT NULL AND pickup_location_warehouse_id IS NULL) OR
    (pickup_location_plant_id IS NULL AND pickup_location_warehouse_id IS NOT NULL)
  );