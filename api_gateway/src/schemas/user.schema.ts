import { z } from "zod";

export const UserSc = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string(),
  token: z.string(),
  createdAt: z.date(),
  username: z.string(),
});

export const UserInputRegisterInfoSc = z.object({
  name: z
    .string({ required_error: "Nombre requerido" })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(50, { message: "El nombre no puede tener más de 50 caracteres." })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: "El nombre solo puede contener letras, espacios y tildes" })
});

export const UserInputRegisterSc = z.object({

  username: z
    .string({ required_error: "username requerido" })
    .min(5, { message: "El usuario debe tener al menos 5 caracteres" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "El usuario solo puede contener letras, números y guiones bajos. Sin espacios." })
    .trim(),

  email: z
    .string({ required_error: "email requerido" })
    .email({ message: "email invalido" }),
  // .trim(),

  password: z
    .string({ required_error: "Contraseña requerida" })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula." })
    .regex(/[a-z]/, { message: "La contraseña debe contener al menos una letra minúscula." })
    .regex(/\d/, { message: "La contraseña debe contener al menos un número." })
    .regex(/[@$!%*?&#]/, { message: "La contraseña debe contener al menos un carácter especial (@, $, !, %, *, ?, & o #)." })
    .trim()
});

export const UserInputLoginSc = z.object({
  user: z.string({ required_error: "usuario requerido" })
    .trim(),
  password: z.string({ required_error: "password requerido" })
    .trim(),
});

// Esquema para el restablecimiento de contraseña
export const ResetPasswordSc = z.object({
  token: z.string().min(1, { message: "Token de restablecimiento requerido" }),
  newPassword: z
    .string({ required_error: "Contraseña requerida" })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula." })
    .regex(/[a-z]/, { message: "La contraseña debe contener al menos una letra minúscula." })
    .regex(/\d/, { message: "La contraseña debe contener al menos un número." })
    .regex(/[@$!%*?&#]/, { message: "La contraseña debe contener al menos un carácter especial (@, $, !, %, *, ?, & o #)." })
    .trim()
  ,
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


