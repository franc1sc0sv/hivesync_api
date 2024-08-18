import { NextFunction, Response } from "express";
import {
  API_STATUS,
  bad_response,
  custom_response,
  StatusCodes,
} from "hivesync_utils";

import RequestServer, { Servers } from "../interfaces/RequestWithServer";
import { AxiosServerService } from "../config/axios";
import { getData, headers_by_json } from "../utlis/http_request";

export const IsServerAdmin = async (
  req: RequestServer,
  res: Response,
  next: NextFunction
) => {
  try {
    const id_server = req.params.id;
    const id_user = req.user?.id as string;

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
      headers: headers_by_json({ data: req.user }),
    });

    console.log(server);

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
  } catch (error) {
    return res.status(500).json(
      bad_response({
        data: { error: error },
        message: "Hubo un error de autentificacion",
      })
    );
  }
};
