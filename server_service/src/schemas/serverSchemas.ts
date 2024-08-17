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
