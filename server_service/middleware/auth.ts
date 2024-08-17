import { NextFunction, Response } from "express";
import RequestWithUser from "../src/interfaces/auth_interface";
import {
  API_STATUS,
  bad_response,
  custom_response,
  StatusCodes,
} from "hivesync_utils";

export const auth_middleware = () => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user?.id) {
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
      return next();
    } catch (error) {
      return res.status(500).json(
        bad_response({
          data: { error: error },
          message: "error de autentificacion",
        })
      );
    }
  };
};
