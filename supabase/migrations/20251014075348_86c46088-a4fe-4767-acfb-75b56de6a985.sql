-- Add priority column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS priority text CHECK (priority IN ('high', 'medium', 'low'));