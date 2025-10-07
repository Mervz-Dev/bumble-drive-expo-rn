import { Enums, Tables } from "../dataTypes";

export declare namespace User {
  type Gender = Enums["gender_enum"];
  type Role = Enums["role_enum"];

  type BaseUser = Tables["users"];

  interface User extends BaseUser {
    driverDetails?: Tables["drivers"];
  }
}
