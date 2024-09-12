import { z } from "zod";

export const CreateEventSchema = z.object({
  name: z.string().min(1, "El nombre del evento es requerido"),
  description: z.string(),
  //   date: z.date(),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "La fecha debe estar en formato ISO válido.",
    })
    .transform((val) => new Date(val)),
});

export const EditEventSchema = z.object({
  eventId: z.string(),
  name: z.string().min(1, "El nombre del evento es requerido"),
  description: z.string(),
  // date: z.date(),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "La fecha debe estar en formato ISO válido.",
    })
    .transform((val) => new Date(val)),
});

export const GetEventFromServerSchema = z.object({
  eventId: z.string().uuid("ID de evento inválido"),
});
