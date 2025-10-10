-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE app_role AS ENUM ('customer', 'admin');
CREATE TYPE order_status AS ENUM ('new', 'allocated', 'picked', 'dispatched', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('none', 'partial', 'paid', 'refunded');
CREATE TYPE wagon_status AS ENUM ('empty', 'in_use', 'maintenance');

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT,
  email TEXT,
  company_name TEXT,
  contact_person TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create materials table
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  material_code TEXT UNIQUE NOT NULL,
  unit TEXT DEFAULT 'tons',
  base_price_per_ton DECIMAL(10,2) NOT NULL,
  hazard_flag BOOLEAN DEFAULT FALSE,
  last_arrival_date TIMESTAMPTZ,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create plants table
CREATE TABLE plants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  siding_capacity INTEGER NOT NULL,
  daily_loading_capacity_tons DECIMAL(10,2) NOT NULL,
  open_hours TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create warehouses table
CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  capacity_tons DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create inventory table (for both plants and warehouses)
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
  available_tons DECIMAL(10,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT inventory_location_check CHECK (
    (plant_id IS NOT NULL AND warehouse_id IS NULL) OR
    (plant_id IS NULL AND warehouse_id IS NOT NULL)
  )
);

-- Create routes table
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id TEXT UNIQUE NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  distance_km DECIMAL(10,2) NOT NULL,
  route_maintenance_flag BOOLEAN DEFAULT FALSE,
  average_delay_on_route_hr DECIMAL(5,2) DEFAULT 0,
  dispatch_day_of_week INTEGER,
  month INTEGER,
  shift TEXT,
  peak_hours BOOLEAN DEFAULT FALSE,
  capacity_factor DECIMAL(5,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wagon_types table
CREATE TABLE wagon_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_name TEXT NOT NULL UNIQUE,
  capacity_ton DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wagons table
CREATE TABLE wagons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wagon_number TEXT UNIQUE NOT NULL,
  type_id UUID REFERENCES wagon_types(id) ON DELETE SET NULL,
  status wagon_status DEFAULT 'empty',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rakes table
CREATE TABLE rakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rake_number TEXT UNIQUE NOT NULL,
  min_rake_size_tons DECIMAL(10,2) DEFAULT 1200,
  max_rake_size_tons DECIMAL(10,2) DEFAULT 3000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rake_wagons junction table
CREATE TABLE rake_wagons (
  rake_id UUID REFERENCES rakes(id) ON DELETE CASCADE,
  wagon_id UUID REFERENCES wagons(id) ON DELETE CASCADE,
  PRIMARY KEY (rake_id, wagon_id)
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
  quantity_tons DECIMAL(10,2) NOT NULL,
  pickup_location_plant_id UUID REFERENCES plants(id) ON DELETE SET NULL,
  pickup_location_warehouse_id UUID REFERENCES warehouses(id) ON DELETE SET NULL,
  delivery_location TEXT NOT NULL,
  cost_per_ton DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  status order_status DEFAULT 'new',
  payment_status payment_status DEFAULT 'none',
  payment_amount DECIMAL(10,2) DEFAULT 0,
  payment_txn_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT orders_pickup_check CHECK (
    (pickup_location_plant_id IS NOT NULL AND pickup_location_warehouse_id IS NULL) OR
    (pickup_location_plant_id IS NULL AND pickup_location_warehouse_id IS NOT NULL)
  )
);

-- Create dispatch_plans table
CREATE TABLE dispatch_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  generated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rake_id UUID REFERENCES rakes(id) ON DELETE SET NULL,
  recommended_composition JSONB,
  total_cost DECIMAL(10,2),
  expected_departure TIMESTAMPTZ,
  expected_arrival TIMESTAMPTZ,
  feasibility_flag BOOLEAN DEFAULT TRUE,
  on_time_probability DECIMAL(5,2),
  cost_breakdown JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create dispatch_plan_orders junction table
CREATE TABLE dispatch_plan_orders (
  dispatch_plan_id UUID REFERENCES dispatch_plans(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  PRIMARY KEY (dispatch_plan_id, order_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wagon_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE wagons ENABLE ROW LEVEL SECURITY;
ALTER TABLE rakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rake_wagons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatch_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatch_plan_orders ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all roles" ON user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view their own role" ON user_roles FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for materials (public read, admin write)
CREATE POLICY "Anyone can view materials" ON materials FOR SELECT USING (TRUE);
CREATE POLICY "Admins can insert materials" ON materials FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update materials" ON materials FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete materials" ON materials FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for plants (public read, admin write)
CREATE POLICY "Anyone can view plants" ON plants FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage plants" ON plants FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for warehouses (public read, admin write)
CREATE POLICY "Anyone can view warehouses" ON warehouses FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage warehouses" ON warehouses FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for inventory (public read, admin write)
CREATE POLICY "Anyone can view inventory" ON inventory FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage inventory" ON inventory FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for routes (public read, admin write)
CREATE POLICY "Anyone can view routes" ON routes FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage routes" ON routes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for wagon_types (public read, admin write)
CREATE POLICY "Anyone can view wagon types" ON wagon_types FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage wagon types" ON wagon_types FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for wagons (public read, admin write)
CREATE POLICY "Anyone can view wagons" ON wagons FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage wagons" ON wagons FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for rakes (public read, admin write)
CREATE POLICY "Anyone can view rakes" ON rakes FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage rakes" ON rakes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for rake_wagons (public read, admin write)
CREATE POLICY "Anyone can view rake wagons" ON rake_wagons FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage rake wagons" ON rake_wagons FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for dispatch_plans (admin only)
CREATE POLICY "Admins can manage dispatch plans" ON dispatch_plans FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for dispatch_plan_orders (admin only)
CREATE POLICY "Admins can manage dispatch plan orders" ON dispatch_plan_orders FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.email
  );
  
  -- Assign customer role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();