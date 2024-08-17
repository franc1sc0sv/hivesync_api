import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, "El nombre de la categoría es requerido"),
});
