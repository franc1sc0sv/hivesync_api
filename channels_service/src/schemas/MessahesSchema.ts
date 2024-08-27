import { z } from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .min(1, "El mensaje no puede estar vacío.")
    .max(500, "El mensaje no puede exceder los 500 caracteres."),
  room: z.string().min(1, "El identificador de sala no puede estar vacío."),
});
