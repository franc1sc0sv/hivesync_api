import { z } from "zod";

export const CreateNotificationSchema = z.object({
  message: z.string().min(1, "El mensaje no puede estar vacío"),
  category: z.enum(["request", "invitation", "message"]),
  json_data: z.any(),
  to_user_id: z.string().uuid("El ID del usuario debe ser un UUID válido"),
});
