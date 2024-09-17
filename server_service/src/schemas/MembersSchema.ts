import { z } from "zod";

export const AddNewMemberToServerSchema = z.object({
  id_user: z
    .string()
    .uuid({ message: "El ID del usuario debe ser un UUID válido" }),
  role: z.string().min(1, { message: "El rol es requerido" }),
});

export const DeleteMemberFromServerSchema = z.object({
  id_user: z
    .string()
    .uuid({ message: "El ID del usuario debe ser un UUID válido" }),
});

export const GetServerMembersFromServerSchema = z.object({
  id: z
    .string()
    .uuid({ message: "El ID del servidor debe ser un UUID válido" }),
});

export const RejectInvitationSchema = z.object({
  notification_id: z.string(),
});
