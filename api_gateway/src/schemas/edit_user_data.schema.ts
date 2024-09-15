import { z } from "zod";

export const IdInputSc = z.object({
    id: z.string({ required_error: "Id requerido" })
});


export const UsernameInputSc = z.object({
    username: z.string({ required_error: "nombre requerido" })
});
