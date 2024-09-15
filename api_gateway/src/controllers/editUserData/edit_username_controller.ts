import { Response } from "express";

import { PrismaClient } from "@prisma/client";

import { IdInputSc, UsernameInputSc } from "../../schemas/edit_user_data.schema";

import { patchData, headers_by_json } from "../../utlis/http_request";
import { AxiosUserInfoService } from "../../config/axios";

import RequestWithUser from "../../interfaces/auth_interface";

import {
    bad_response,
    detect_zod_error,
    error_response,
    good_response,
} from "hivesync_utils";

const prisma = new PrismaClient();

export const edit_username = async (req: RequestWithUser, res: Response) => {
    try {
        const userId = req.user?.id;
        const token = req.user?.token;
        const name = req.body.username;

        if (!token) {
            return res.status(401).json(
                error_response({
                    data: {
                        message: "Token no proporcionado"
                    }
                })
            );
        }
        const parsed_id = IdInputSc.parse({ id: userId });
        const parsed_username = UsernameInputSc.parse({ username: name });

        const user = await prisma.user.findFirst({
            where: {
                id: parsed_id.id
            }
        })

        if (!user) {
            return res.status(400).json(
                error_response({
                    data: {
                        message: "Usuario no encontrado"
                    }
                })
            )
        }

        const newName = await prisma.user.update({
            where: {
                id: parsed_id.id
            }, data: {
                username: parsed_username.username
            }
        })

        await patchData({
            url: "/user/edit/username",
            id: parsed_id.id,
            data: parsed_username,
            AxiosConfig: AxiosUserInfoService,
            headers: headers_by_json({ data: req.user })
        });


        return res.status(200).json(
            good_response({
                data: { ...newName },
                message: "Datos actualizados"
            })
        )

    } catch (error) {
        console.error(error);
        const zod_error = detect_zod_error({ error });
        if (zod_error?.error)
            return res
                .status(400)
                .json(
                    error_response({ data: { error: error, message: zod_error.error } })
                );

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