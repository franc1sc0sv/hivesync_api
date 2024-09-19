import { z } from "zod";

export const IdInputSc = z.object({
    id: z.string({ required_error: "Id requerido" })
});


export const UsernameInputSc = z.object({
    username: z.string({ required_error: "nombre requerido" })
});

export const Username_aboutInputSc = z.object({
    username: z.string({ required_error: "nombre requerido" }),
    about: z.string({ required_error: "descripción requerida requerida" })
});
