import config from "@/config";
import { Database } from "@/types/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

export const supabase = createClient(
  config.supabase.url!,
  config.supabase.anonKey!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

type Tables = Database["public"]["Tables"];

export class SupabaseDatabase {
  private client = supabase;

  // DB
  async select<T extends keyof Tables, Q extends string = "*">(
    table: T,
    query?: Q,
    filter: Record<string, any> = {}
  ): Promise<Tables[T]["Row"][]> {
    try {
      const { data, error } = await this.client
        .from(table)
        .select(query ?? "*")
        .match(filter);

      if (error) throw error;
      return data as Tables[T]["Row"][];
    } catch (err) {
      console.error(err);
      // console.error(err)
      throw err;
    }
  }

  async insert<T extends keyof Tables>(
    table: T,
    values: Tables[T]["Insert"]
  ): Promise<Tables[T]["Row"][]> {
    try {
      const { data, error } = await this.client
        .from(table)
        .insert(values)
        .select();
      if (error) throw error;
      return data as Tables[T]["Row"][];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update<T extends keyof Tables>(
    table: T,
    values: Tables[T]["Update"],
    filter: Record<string, any>
  ): Promise<Tables[T]["Row"][]> {
    try {
      const { data, error } = await this.client
        .from(table)
        .update(values)
        .match(filter)
        .select();
      if (error) throw error;
      return data as Tables[T]["Row"][];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async delete<T extends keyof Tables>(
    table: T,
    filter: Record<string, any>
  ): Promise<Tables[T]["Row"][]> {
    try {
      const { data, error } = await this.client
        .from(table)
        .delete()
        .match(filter)
        .select();
      if (error) throw error;
      return data as Tables[T]["Row"][];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
