import { NextFunction, Response } from "express";
import {
  API_STATUS,
  bad_response,
  custom_response,
  StatusCodes,
} from "hivesync_utils";
import RequestServer, { Servers } from "../interfaces/RequestWithServer";
import { getData, headers_by_json } from "../utlis/http_request";
import { AxiosServerService } from "../config/axios";
import { Server } from "../types/server";

export const IsServerAdminOrMemberExternal = async (
  req: RequestServer,
  res: Response,
  next: NextFunction
) => {
  try {
    const id_server = req.params.id;
    const id_user = req.user?.id as string;

    if (!id_server) {
      return res.status(401).json(
        custom_response({
          data: {
            message: "ID del servidor no existe",
          },
          code: StatusCodes.UNAUTHORIZED,
          status: API_STATUS.ACCESS_DENIED,
        })
      );
    }

    const server: Server = await getData({
      AxiosConfig: AxiosServerService,
      url: `/management/basic/${id_server}`,
      headers: headers_by_json({ data: req.user }),
    });

    if (!server) {
      return res.status(401).json(
        custom_response({
          data: {
            message: "El servidor no existe",
          },
          code: StatusCodes.UNAUTHORIZED,
          status: API_STATUS.ACCESS_DENIED,
        })
      );
    }

    const server_to_send: Servers = {
      id: server.id,
      name: server.name,
      avatarURL: server.avatarURL,
      privacity: server.privacity,
      id_user: server.id_user,
      createdAt: new Date(server.createdAt),
    };

    if (server.id_user === id_user) {
      req.server = { ...server_to_send };
      return next();
    }

    const isMember = server.members.filter(
      (member) => member.id_user === id_server
    );

    if (!isMember) {
      return res.status(403).json(
        custom_response({
          data: {
            message: "Acceso denegado, no eres miembro del servidor",
          },
          code: StatusCodes.FORBIDDEN,
          status: API_STATUS.ACCESS_DENIED,
        })
      );
    }

    req.server = { ...server_to_send };
    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json(
      bad_response({
        data: { error: error },
        message: "Hubo un error de autenticación",
      })
    );
  }
};
