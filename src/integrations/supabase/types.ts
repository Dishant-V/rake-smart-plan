export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      dispatch_plan_orders: {
        Row: {
          dispatch_plan_id: string
          order_id: string
        }
        Insert: {
          dispatch_plan_id: string
          order_id: string
        }
        Update: {
          dispatch_plan_id?: string
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispatch_plan_orders_dispatch_plan_id_fkey"
            columns: ["dispatch_plan_id"]
            isOneToOne: false
            referencedRelation: "dispatch_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_plan_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      dispatch_plans: {
        Row: {
          cost_breakdown: Json | null
          created_at: string | null
          expected_arrival: string | null
          expected_departure: string | null
          feasibility_flag: boolean | null
          generated_by: string | null
          id: string
          notes: string | null
          on_time_probability: number | null
          rake_id: string | null
          recommended_composition: Json | null
          total_cost: number | null
        }
        Insert: {
          cost_breakdown?: Json | null
          created_at?: string | null
          expected_arrival?: string | null
          expected_departure?: string | null
          feasibility_flag?: boolean | null
          generated_by?: string | null
          id?: string
          notes?: string | null
          on_time_probability?: number | null
          rake_id?: string | null
          recommended_composition?: Json | null
          total_cost?: number | null
        }
        Update: {
          cost_breakdown?: Json | null
          created_at?: string | null
          expected_arrival?: string | null
          expected_departure?: string | null
          feasibility_flag?: boolean | null
          generated_by?: string | null
          id?: string
          notes?: string | null
          on_time_probability?: number | null
          rake_id?: string | null
          recommended_composition?: Json | null
          total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dispatch_plans_rake_id_fkey"
            columns: ["rake_id"]
            isOneToOne: false
            referencedRelation: "rakes"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          available_tons: number
          id: string
          material_id: string | null
          plant_id: string | null
          updated_at: string | null
          warehouse_id: string | null
        }
        Insert: {
          available_tons?: number
          id?: string
          material_id?: string | null
          plant_id?: string | null
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Update: {
          available_tons?: number
          id?: string
          material_id?: string | null
          plant_id?: string | null
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          base_price_per_ton: number
          created_at: string | null
          hazard_flag: boolean | null
          id: string
          image_url: string | null
          last_arrival_date: string | null
          material_code: string
          name: string
          unit: string | null
        }
        Insert: {
          base_price_per_ton: number
          created_at?: string | null
          hazard_flag?: boolean | null
          id?: string
          image_url?: string | null
          last_arrival_date?: string | null
          material_code: string
          name: string
          unit?: string | null
        }
        Update: {
          base_price_per_ton?: number
          created_at?: string | null
          hazard_flag?: boolean | null
          id?: string
          image_url?: string | null
          last_arrival_date?: string | null
          material_code?: string
          name?: string
          unit?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          cost_per_ton: number
          created_at: string | null
          customer_id: string
          deadline: string
          delivery_location: string
          id: string
          material_id: string | null
          payment_amount: number | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          payment_txn_id: string | null
          pickup_location_plant_id: string | null
          pickup_location_warehouse_id: string | null
          priority: string | null
          quantity_tons: number
          status: Database["public"]["Enums"]["order_status"] | null
          total_cost: number
          updated_at: string | null
        }
        Insert: {
          cost_per_ton: number
          created_at?: string | null
          customer_id: string
          deadline: string
          delivery_location: string
          id?: string
          material_id?: string | null
          payment_amount?: number | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          payment_txn_id?: string | null
          pickup_location_plant_id?: string | null
          pickup_location_warehouse_id?: string | null
          priority?: string | null
          quantity_tons: number
          status?: Database["public"]["Enums"]["order_status"] | null
          total_cost: number
          updated_at?: string | null
        }
        Update: {
          cost_per_ton?: number
          created_at?: string | null
          customer_id?: string
          deadline?: string
          delivery_location?: string
          id?: string
          material_id?: string | null
          payment_amount?: number | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          payment_txn_id?: string | null
          pickup_location_plant_id?: string | null
          pickup_location_warehouse_id?: string | null
          priority?: string | null
          quantity_tons?: number
          status?: Database["public"]["Enums"]["order_status"] | null
          total_cost?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_pickup_location_plant_id_fkey"
            columns: ["pickup_location_plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_pickup_location_warehouse_id_fkey"
            columns: ["pickup_location_warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      plants: {
        Row: {
          created_at: string | null
          daily_loading_capacity_tons: number
          id: string
          location: string
          name: string
          open_hours: string | null
          siding_capacity: number
        }
        Insert: {
          created_at?: string | null
          daily_loading_capacity_tons: number
          id?: string
          location: string
          name: string
          open_hours?: string | null
          siding_capacity: number
        }
        Update: {
          created_at?: string | null
          daily_loading_capacity_tons?: number
          id?: string
          location?: string
          name?: string
          open_hours?: string | null
          siding_capacity?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          phone: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          company_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          company_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      rake_wagons: {
        Row: {
          rake_id: string
          wagon_id: string
        }
        Insert: {
          rake_id: string
          wagon_id: string
        }
        Update: {
          rake_id?: string
          wagon_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rake_wagons_rake_id_fkey"
            columns: ["rake_id"]
            isOneToOne: false
            referencedRelation: "rakes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rake_wagons_wagon_id_fkey"
            columns: ["wagon_id"]
            isOneToOne: false
            referencedRelation: "wagons"
            referencedColumns: ["id"]
          },
        ]
      }
      rakes: {
        Row: {
          created_at: string | null
          id: string
          max_rake_size_tons: number | null
          min_rake_size_tons: number | null
          rake_number: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_rake_size_tons?: number | null
          min_rake_size_tons?: number | null
          rake_number: string
        }
        Update: {
          created_at?: string | null
          id?: string
          max_rake_size_tons?: number | null
          min_rake_size_tons?: number | null
          rake_number?: string
        }
        Relationships: []
      }
      routes: {
        Row: {
          average_delay_on_route_hr: number | null
          capacity_factor: number | null
          created_at: string | null
          destination: string
          dispatch_day_of_week: number | null
          distance_km: number
          id: string
          month: number | null
          origin: string
          peak_hours: boolean | null
          route_id: string
          route_maintenance_flag: boolean | null
          shift: string | null
        }
        Insert: {
          average_delay_on_route_hr?: number | null
          capacity_factor?: number | null
          created_at?: string | null
          destination: string
          dispatch_day_of_week?: number | null
          distance_km: number
          id?: string
          month?: number | null
          origin: string
          peak_hours?: boolean | null
          route_id: string
          route_maintenance_flag?: boolean | null
          shift?: string | null
        }
        Update: {
          average_delay_on_route_hr?: number | null
          capacity_factor?: number | null
          created_at?: string | null
          destination?: string
          dispatch_day_of_week?: number | null
          distance_km?: number
          id?: string
          month?: number | null
          origin?: string
          peak_hours?: boolean | null
          route_id?: string
          route_maintenance_flag?: boolean | null
          shift?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wagon_types: {
        Row: {
          capacity_ton: number
          created_at: string | null
          id: string
          type_name: string
        }
        Insert: {
          capacity_ton: number
          created_at?: string | null
          id?: string
          type_name: string
        }
        Update: {
          capacity_ton?: number
          created_at?: string | null
          id?: string
          type_name?: string
        }
        Relationships: []
      }
      wagons: {
        Row: {
          created_at: string | null
          id: string
          status: Database["public"]["Enums"]["wagon_status"] | null
          type_id: string | null
          wagon_number: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["wagon_status"] | null
          type_id?: string | null
          wagon_number: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["wagon_status"] | null
          type_id?: string | null
          wagon_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "wagons_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "wagon_types"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          capacity_tons: number
          created_at: string | null
          id: string
          location: string
          name: string
        }
        Insert: {
          capacity_tons: number
          created_at?: string | null
          id?: string
          location: string
          name: string
        }
        Update: {
          capacity_tons?: number
          created_at?: string | null
          id?: string
          location?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "admin"
      order_status:
        | "new"
        | "allocated"
        | "picked"
        | "dispatched"
        | "delivered"
        | "cancelled"
      payment_status: "none" | "partial" | "paid" | "refunded"
      wagon_status: "empty" | "in_use" | "maintenance"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "admin"],
      order_status: [
        "new",
        "allocated",
        "picked",
        "dispatched",
        "delivered",
        "cancelled",
      ],
      payment_status: ["none", "partial", "paid", "refunded"],
      wagon_status: ["empty", "in_use", "maintenance"],
    },
  },
} as const
