import { PrivacityServer } from "@prisma/client";
import { z } from "zod";

export const CreateServerSchema = z.object({
  name: z.string().min(1, "El nombre del servidor es requerido"),
  avatarURL: z.string().url("La URL del avatar no es válida").optional(),
  privacity: z.nativeEnum(PrivacityServer, {
    errorMap: () => ({ message: "Privacidad del servidor no válida" }),
  }),
  tags: z.array(z.string().uuid("ID de etiqueta no válido")).optional(),
});

export const EditInfoServerSchema = z.object({
  name: z.string().min(1, "El nombre del servidor es requerido").optional(),
  privacity: z.nativeEnum(PrivacityServer).optional(),
});

export const EditServerNameSchema = z.object({
  name: z.string().min(1, "El nombre del servidor es requerido").optional(),
});


export const EditServerCoverSchema = z.object({
  color: z.string().regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/, {
    message: "Color hexadecimal invalido",
  }),
});



