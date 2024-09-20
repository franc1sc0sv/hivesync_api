import { NextFunction, Response } from "express";

import {
  API_STATUS,
  bad_response,
  custom_response,
  StatusCodes,
} from "hivesync_utils";
import RequestWithUser from "../interfaces/auth_interface";

import { Request } from "express";
import { User } from "../types/user";

const decodeUserHeader = (req: Request): User | null => {
  const userHeader = req.headers.user as string | undefined;

  if (!userHeader) {
    console.error("No user header found");
    return null;
  }

  try {
    const decodedString = Buffer.from(userHeader, "base64").toString("utf-8");
    return JSON.parse(decodedString) as User; // Asume que 'User' es tu tipo definido
  } catch (error) {
    console.error("Error decoding or parsing user:", error);
    return null;
  }
};

export default decodeUserHeader;

export const auth_middleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = decodeUserHeader(req);

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

    req.user = user;
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
