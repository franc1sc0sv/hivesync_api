import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { z } from 'zod';
import { sendResetPasswordEmail } from "../../utlis/email";
import { good_response, bad_response, error_response } from "../../utlis/responseUtils";

// Esquema para la solicitud de restablecimiento de contraseña
export const RequestPasswordResetSc = z.object({
  email: z.string()
    .email({ message: "El correo electrónico debe ser válido" })
    .min(1, { message: "El correo electrónico es requerido" }),
});

const prisma = new PrismaClient();

export const requestPasswordReset = async (req: Request, res: Response) => {
    try {
        // Validar los datos de entrada utilizando Zod
        const parsedData = RequestPasswordResetSc.parse(req.body);
        const { email } = parsedData;

        // Buscar al usuario en la base de datos
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json(
                error_response({
                    data: { message: "Usuario no encontrado" }
                })
            );
        }

        // Generar el token de restablecimiento
        const resetToken = sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        // Enviar el correo de restablecimiento
        await sendResetPasswordEmail(user.email, resetToken);

        return res.status(200).json(
            good_response({
                data: {},
                message: "Correo de restablecimiento enviado"
            })
        );

    } catch (error) {
        if (error instanceof z.ZodError) {
            // Manejar errores de validación
            return res.status(400).json(
                bad_response({
                    data: {
                        message: "Errores de validación",
                        errors: error.errors,
                    },
                })
            );
        } else {
            // Manejar otros tipos de errores
            console.error(error);
            return res.status(500).json(
                bad_response({
                    data: {
                        message: "Error en el servidor",
                        error: error,
                    },
                })
            );
        }
    }
};
