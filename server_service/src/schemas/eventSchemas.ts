import { z } from "zod";

export const CreateEventSchema = z.object({
  name: z.string().min(1, "El nombre del evento es requerido"),
  description: z.string(),
  date: z.date(),
});

export const EditEventSchema = z.object({
  name: z.string().min(1, "El nombre del evento es requerido"),
  description: z.string(),
  date: z.date(),
});

export const GetEventFromServerSchema = z.object({
  eventId: z.string().uuid("ID de evento inválido"),
});
