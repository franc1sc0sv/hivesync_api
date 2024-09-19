import { Request, Response } from 'express';
import { z } from 'zod';
import { ResetPasswordSc } from '../../schemas/user.schema';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();

export const resetPassword = async (req: Request, res: Response) => {
    try {
        // Validar los datos de entrada
        const parsedData = ResetPasswordSc.parse(req.body);

        const { token, newPassword } = parsedData;

        // Verificar el token JWT
        const decodedToken = verify(token, process.env.JWT_SECRET!) as { userId: string };

        // Buscar al usuario en la base de datos
        const user = await prisma.user.findUnique({ where: { id: decodedToken.userId } });

        if (!user) {
            
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña del usuario
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        return res.status(200).json({
            message: 'Contraseña restablecida con éxito'
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Manejar errores de validación
            return res.status(400).json({
                message: 'Errores de validación',
                errors: error.errors
            });
        } else {
            const serverError = error as Error; // Casting de error a tipo Error
            // Manejar otros tipos de errores
            console.error('Error:', serverError.message);
            return res.status(500).json({
                message: 'Error en el servidor',
                error: serverError.message
            });
        }
    }
};
