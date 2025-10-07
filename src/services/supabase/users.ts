import { User } from "@/types/app/user";
import { SupabaseDatabase } from "./db";

const db = new SupabaseDatabase();

export const getUserById = async (userId: string): Promise<User.User> => {
  const user = (await db.select(
    "users",
    "*, driverDetails:drivers(*)",
    { id: { eq: userId } },
    "single"
  )) as User.User;

  return user;
};

export const updateUserById = async (
  user: Partial<User.User>,
  userId: string
) => {
  return await db.update("users", user, { id: userId });
};
