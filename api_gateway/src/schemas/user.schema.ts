import { z } from "zod";

export const UserSc = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
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
    .min(3, { message: "username min length" }),
  name: z
    .string({ required_error: "name requerido" })
    .min(3, { message: "name  min length" }),
});

export const UserInputLoginSc = z.object({
  email: z
    .string({ required_error: "email requerido" })
    .email({ message: "email invalido" }),
  password: z
    .string({ required_error: "password requerido" })
    .min(8, { message: "password min length" }),
});
