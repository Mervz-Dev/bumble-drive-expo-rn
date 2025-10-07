import { z } from "zod";

export default z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name too long"),
});
