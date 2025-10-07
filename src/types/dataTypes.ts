import { Database } from "./database";
import { Camelize } from "./utility";

type SupabaseTables = Database["public"]["Tables"];
type SupabaseEnums = Database["public"]["Enums"];

export type Tables = {
  [K in keyof SupabaseTables]: Camelize<SupabaseTables[K]["Row"]>;
};

export type Enums = SupabaseEnums;
