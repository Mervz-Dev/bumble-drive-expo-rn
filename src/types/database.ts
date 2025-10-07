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
      drivers: {
        Row: {
          created_at: string | null
          driver_license_number: string | null
          id: string
          is_driver_active: boolean | null
          is_driver_verified: boolean | null
          updated_at: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_plate_number: string | null
        }
        Insert: {
          created_at?: string | null
          driver_license_number?: string | null
          id: string
          is_driver_active?: boolean | null
          is_driver_verified?: boolean | null
          updated_at?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_plate_number?: string | null
        }
        Update: {
          created_at?: string | null
          driver_license_number?: string | null
          id?: string
          is_driver_active?: boolean | null
          is_driver_verified?: boolean | null
          updated_at?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_plate_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      passengers: {
        Row: {
          created_at: string | null
          id: string
          preferred_payment:
            | Database["public"]["Enums"]["payment_method"]
            | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          preferred_payment?:
            | Database["public"]["Enums"]["payment_method"]
            | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          preferred_payment?:
            | Database["public"]["Enums"]["payment_method"]
            | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "passengers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_otps: {
        Row: {
          code: string
          consumed: boolean | null
          created_at: string | null
          expires_at: string
          id: number
          phone: string
        }
        Insert: {
          code: string
          consumed?: boolean | null
          created_at?: string | null
          expires_at: string
          id?: never
          phone: string
        }
        Update: {
          code?: string
          consumed?: boolean | null
          created_at?: string | null
          expires_at?: string
          id?: never
          phone?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          birthday: string | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender_enum"] | null
          id: string
          name: string | null
          phone_number: string | null
          role: Database["public"]["Enums"]["role_enum"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          birthday?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          id: string
          name?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["role_enum"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          birthday?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          id?: string
          name?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["role_enum"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gender_enum: "male" | "female" | "other"
      payment_method: "cash" | "card" | "wallet"
      role_enum: "passenger" | "driver" | "both"
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
      gender_enum: ["male", "female", "other"],
      payment_method: ["cash", "card", "wallet"],
      role_enum: ["passenger", "driver", "both"],
    },
  },
} as const
