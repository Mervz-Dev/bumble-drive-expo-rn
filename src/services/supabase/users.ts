import { User } from "@/types/app/user";
import { SupabaseDatabase } from "./db";

export const getUserById = async (userId: string): Promise<User.User> => {
  const db = new SupabaseDatabase();

  const user = (await db.select(
    "users",
    "*, driverDetails:drivers(*)",
    { id: { eq: userId } },
    "single"
  )) as User.User;

  return user;
};
