import { NextFunction, Response } from "express";
import { API_STATUS, custom_response, StatusCodes } from "hivesync_utils";
import { PrismaClient } from "@prisma/client";
import RequestServer from "../interfaces/RequestWithServer";

const prisma = new PrismaClient();

export const IsServerAdmin = async (
  req: RequestServer,
  res: Response,
  next: NextFunction
) => {
  try {
    const id_server = req.params.id;
    const id_user = req.headers.user?.id as string;

    if (!id_server)
      return res.status(401).json(
        custom_response({
          data: {
            message: "Acceso no permitido",
          },
          code: StatusCodes.UNAUTHORIZED,
          status: API_STATUS.ACCESS_DENIED,
        })
      );

    const server = await prisma.servers.findUnique({
      where: { id: id_server },
    });

    if (!server) {
      return res.status(401).json(
        custom_response({
          data: {
            message: "Acceso no permitido",
          },
          code: StatusCodes.UNAUTHORIZED,
          status: API_STATUS.ACCESS_DENIED,
        })
      );
    }

    if (server.id_user !== id_user) {
      return res.status(401).json(
        custom_response({
          data: {
            message: "Acceso no permitido",
          },
          code: StatusCodes.UNAUTHORIZED,
          status: API_STATUS.ACCESS_DENIED,
        })
      );
    }

    req.server = { ...server };
    return next();

    return res.status(401).json({
      status: "FAILED",
      data: { message: "No eres administrador del server" },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Hubo un error de autentificacion",
    });
  }
};
