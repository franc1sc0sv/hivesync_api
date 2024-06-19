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
