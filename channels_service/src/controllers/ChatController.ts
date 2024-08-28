import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ZodError } from "zod";
import {
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";
import { messageSchema } from "../schemas/MessahesSchema";
import RequestWithUser from "../interfaces/auth_interface";

const prisma = new PrismaClient();

export const SendMessageController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const validatedData = messageSchema.parse(req.body);
    const id_user = req.user?.id as string;

    const message = await prisma.messages.create({
      data: {
        id_sender: id_user,
        message: validatedData.message,
        room: validatedData.room,
      },
    });

    return res.status(200).json(
      good_response({
        data: message,
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });
    console.log(error);
    if (error instanceof ZodError) {
      return res.status(400).json(
        error_response({
          data: { error: error, message: zod_error?.error },
        })
      );
    }
    return res.status(500).json(
      error_response({
        data: { error: error, message: "Error creando el mensaje" },
      })
    );
  }
};

export const GetMessagesController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const room = req.params.id;

    if (!room) {
      return res.status(400).json(
        error_response({
          data: {
            message: "ID no existe",
          },
        })
      );
    }

    const messages = await prisma.messages.findMany({
      where: { room: room },
    });

    return res.status(201).json(
      good_response({
        data: messages,
      })
    );
  } catch (error) {
    return res.status(500).json(
      error_response({
        data: { error: error, message: "Error obteniendo el mensaje" },
      })
    );
  }
};
