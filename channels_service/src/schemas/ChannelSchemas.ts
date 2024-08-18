import { ChannelType } from "@prisma/client";
import { z } from "zod";

export const CreateChannelSchema = z.object({
  name: z.string().min(1, "El nombre del canal es requerido"),
  CategoryID: z.string().uuid("ID de categoría inválido"),
  type: z.nativeEnum(ChannelType, {
    errorMap: () => ({ message: "Tipo de canal no válida" }),
  }),
});

export const CreateManyChannelsSchema = z.array(CreateChannelSchema);

export const DeleteChannelSchema = z.object({
  channelId: z.string().uuid("ID del canal inválido"),
});

export const EditChannelSchema = z.object({
  serverID: z.string().uuid("ID del server inválido"),
  channelId: z.string().uuid("ID del canal inválido"),
  name: z.string().min(1, "El nombre del canal es requerido").optional(),
  CategoryID: z.string().uuid("ID de categoría inválido").optional(),
});

export const GetChannelFromServerSchema = z.object({
  channelId: z.string().uuid("ID del canal inválido"),
});
