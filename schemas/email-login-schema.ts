import { z } from "zod";

export default z.object({
  email: z.string().email("Email Invalid"),
  password: z.string().nonempty("Password is required"),
});
