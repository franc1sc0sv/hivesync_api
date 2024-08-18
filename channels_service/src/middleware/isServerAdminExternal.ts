import { NextFunction, Response } from "express";
import { API_STATUS, custom_response, StatusCodes } from "hivesync_utils";

import RequestServer, { Servers } from "../interfaces/RequestWithServer";
import { AxiosServerService } from "../config/axios";
import { getData } from "../utlis/http_request";

export const IsServerAdmin = async (
  req: RequestServer,
  res: Response,
  next: NextFunction
) => {
  try {
    const id_server = req.params.id;

    const id_user = req.user.id as string;
    const token = req.user.token as string;

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

    const server: Servers = await getData({
      AxiosConfig: AxiosServerService,
      url: `/management/${id_server}`,
      token: token,
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
