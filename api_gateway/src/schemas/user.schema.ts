import { z } from "zod";

export const UserSc = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string(),
  token: z.string(),
  createdAt: z.date(),
  username: z.string(),
});

export const UserInputRegisterSc = z.object({
  email: z
    .string({ required_error: "email requerido" })
    .email({ message: "email invalido" }),
  password: z
    .string({ required_error: "password requerido" })
    .min(8, { message: "password min length" }),
  username: z
    .string({ required_error: "username requerido" })
    .min(5, { message: "username min length" }),
});

export const UserInputRegisterInfoSc = z.object({
  name: z
    .string({ required_error: "nombre requerido" })
    .min(2, { message: "name min length" }),
});

export const UserInputLoginSc = z.object({
  user: z.string({ required_error: "usuario requerido" }),
  password: z.string({ required_error: "password requerido" }),
});

// Esquema para el restablecimiento de contraseña
export const ResetPasswordSc = z.object({
  token: z.string().min(1, { message: "Token de restablecimiento requerido" }),
  newPassword: z.string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .min(1, { message: "La nueva contraseña es requerida" }),
});

// Esquema para la solicitud de restablecimiento de contraseña
export const RequestPasswordResetSc = z.object({
  email: z.string()
    .email({ message: "El correo electrónico debe ser válido" })
    .min(1, { message: "El correo electrónico es requerido" }),
});

// Inferir el tipo a partir del esquema
export type RequestPasswordResetInput = z.infer<typeof RequestPasswordResetSc>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSc>;


