import { NextFunction, Response } from "express";

import {
  API_STATUS,
  bad_response,
  custom_response,
  StatusCodes,
} from "hivesync_utils";
import RequestWithUser from "../interfaces/auth_interface";

export const auth_middleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.headers.user;
    const formatedUser = JSON.parse(user as string);

    if (!formatedUser?.id) {
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
    req.user = formatedUser;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(
      bad_response({
        data: { error: error },
        message: "error de autentificacion",
      })
    );
  }
};
