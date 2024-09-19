import { PrismaClient } from "@prisma/client";

import { Request, Response } from "express";
import {
    bad_response,
    good_response,
} from "hivesync_utils";

import { ColorInputSc, Username_about_meSc } from "../../schemas/user.schema";

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

        const newData = await prisma.userInfo.update({
            where: {
                id: user.id
            }, data: {
                username: userData
            }
        })

        return res.status(200).json(good_response(
            { data: newData, message: "Datos actualizados" }
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

export const edit_name = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const userData = req.body.name;

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

        const newData = await prisma.userInfo.update({
            where: {
                id: user.id
            }, data: {
                name: userData
            }
        })

        return res.status(200).json(good_response(
            { data: newData, message: "Datos actualizados" }
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

export const edit_about_me = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const userData = req.body.about;

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

        const newData = await prisma.userInfo.update({
            where: {
                id: user.id
            }, data: {
                about: userData
            }
        })

        return res.status(200).json(good_response(
            { data: newData, message: "Datos actualizados" }
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

export const edit_cover_color = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const userData = req.body.backgroundUrl;
        const parsed_color = ColorInputSc.parse(userData);

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

        const newData = await prisma.userInfo.update({
            where: {
                id: user.id
            }, data: {
                backgroundUrl: parsed_color
            }
        })

        return res.status(200).json(good_response(
            { data: newData, message: "Datos actualizados" }
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

export const reset_cover_color = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

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

        const newData = await prisma.userInfo.update({
            where: {
                id: user.id
            }, data: {
                backgroundUrl: "#45156B"
            }
        })

        return res.status(200).json(good_response(
            { data: newData, message: "Datos actualizados" }
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

//controlador para form de edición rápida de perfil
export const edit_username_about_me = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const userData = req.body;
        const parsed_data = Username_about_meSc.parse(userData);

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

        const newData = await prisma.userInfo.update({
            where: {
                id: user.id
            }, data: {
                username: parsed_data.username,
                about: parsed_data.about
            }
        })

        return res.status(200).json(good_response(
            { data: newData, message: "Datos actualizados" }
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
