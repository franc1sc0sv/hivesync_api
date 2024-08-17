import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { bad_response } from "hivesync_utils";

import RequestWithUser from "../interfaces/auth_interface";

const prisma = new PrismaClient();

export const auth_middleware_microservices = () => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const auth = req.headers.authorization;
      console.log(auth);

      if (!auth || !auth.startsWith("Bearer")) {
        req.user = {};
        return next();
      }

      const JWT_SECRET = process.env.JWT_SECRET;

      const token = auth.split(" ")[1];
      const token_verified: any = jwt.verify(token, JWT_SECRET as string);

      const user = await prisma.user.findFirst({
        where: {
          id: token_verified.id,
        },
      });

      if (!user) {
        req.user = {};
        return next();
      }

      req.user = user;
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
