import { z } from "zod";

export const UserInputInfo = z.object({
  id_user: z.string({ required_error: "id requerido" }).uuid(),
  name: z
    .string({ required_error: "name requerido" })
    .min(2, { message: "name  min length" }),
});
