import { Database } from "@/types/database";
import { Camelize } from "@/types/utility";
import camelcaseKeys from "camelcase-keys";
import "react-native-url-polyfill/auto";
import { supabase } from "./index";

type Tables = Database["public"]["Tables"];

type FilterOperators<T> = {
  eq?: T;
  neq?: T;
  gt?: T;
  gte?: T;
  lt?: T;
  lte?: T;
  like?: string;
  ilike?: string;
  in?: T[];
  is?: T | null;
};

type Filters<TableRow> = {
  [K in keyof TableRow]?: TableRow[K] | FilterOperators<TableRow[K]>;
};

type SelectMode = "many" | "single" | "maybe";

export class SupabaseDatabase {
  private client = supabase;

  async select<
    T extends keyof Tables,
    Q extends string = "*",
    M extends SelectMode = "many",
  >(
    table: T,
    query?: Q,
    filter: Filters<Tables[T]["Row"]> = {},
    mode?: M
  ): Promise<
    M extends "single"
      ? Camelize<Tables[T]["Row"]>
      : M extends "maybe"
        ? Camelize<Tables[T]["Row"]> | null
        : Camelize<Tables[T]["Row"]>[]
  > {
    let builder = this.client.from(table).select(query ?? "*");

    for (const [column, condition] of Object.entries(filter)) {
      if (condition === undefined) continue;

      if (
        condition !== null &&
        typeof condition === "object" &&
        !Array.isArray(condition)
      ) {
        for (const [op, value] of Object.entries(condition)) {
          // @ts-expect-error dynamic supabase operator
          builder = builder[op](column, value);
        }
      } else {
        builder = builder.eq(column, condition);
      }
    }

    try {
      const result =
        mode === "single"
          ? await builder.single()
          : mode === "maybe"
            ? await builder.maybeSingle()
            : await builder;

      if (result.error) throw result.error;

      const data = result.data;
      return camelcaseKeys(data as object, { deep: true }) as any;
    } catch (error) {
      console.error(
        `[SupabaseDatabase.select] Error in table "${table}"`,
        error
      );
      throw error;
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
    } catch (error) {
      console.error(error);
      throw error;
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
