import { z } from "zod";

export default z.object({
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
  otp: z.string().min(6, ""),
});
