import { Response } from "express";
import RequestWithUser from "../interfaces/auth_interface";
import { PrismaClient } from "@prisma/client";
import {
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";
import { DeleteFriendSchema } from "../schemas/Friends";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export const GetFriendsByUser = async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.user?.id as string;

    const friends = await prisma.friends.findMany({
      where: {
        OR: [{ friend1: userId }, { friend2: userId }],
      },
    });

    return res.status(200).json(
      good_response({
        data: friends,
        message: "Lista de amigos obtenida con éxito",
      })
    );
  } catch (error) {
    return res.status(500).json(
      error_response({
        data: { error: error },
        message: "Error obteniendo la lista de amigos",
      })
    );
  }
};

export const DeleteFriend = async (req: RequestWithUser, res: Response) => {
  try {
    const validatedData = DeleteFriendSchema.parse(req.body);
    const userId = req.user?.id as string;

    const friendship = await prisma.friends.findFirst({
      where: {
        OR: [
          { friend1: userId, friend2: validatedData.friendId },
          { friend1: validatedData.friendId, friend2: userId },
        ],
      },
    });

    if (!friendship) {
      return res.status(404).json(
        error_response({
          data: { message: "Amistad no encontrada" },
        })
      );
    }

    await prisma.friends.delete({
      where: { id: friendship.id },
    });

    return res.status(200).json(
      good_response({
        data: { friendId: validatedData.friendId },
        message: "Amigo eliminado con éxito",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });

    if (error instanceof ZodError) {
      return res
        .status(400)
        .json(
          error_response({ data: { error: error, message: zod_error?.error } })
        );
    }
    return res.status(500).json(
      error_response({
        data: { error: error },
        message: "Error eliminando amigo",
      })
    );
  }
};