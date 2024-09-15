import { PrismaClient } from "@prisma/client";

import { Request, Response } from "express";
import {
    bad_response,
    good_response,
} from "hivesync_utils";

const prisma = new PrismaClient();

export const edit_username = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const userData = req.body.username;

        const user = await prisma.userInfo.findFirst({
            where: {
                id_user: userId
            }
        })

        if (!user) {
            return res.status(404).json(
                bad_response({
                    data: { message: "Usuario no encontrado" },
                })
            );
        }

        const newUsername = await prisma.userInfo.update({
            where: {
                id: user.id
            }, data: {
                username: userData
            }
        })

        return res.status(200).json(good_response(
            { data: newUsername, message: "Datos actualizados" }
        ));
    } catch (error) {
        console.log(error);

        return res.status(500).json(
            bad_response({
                data: {
                    message: "error en el servidor",
                    error: error,
                },
            })
        );
    }
}