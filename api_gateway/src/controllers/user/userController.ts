import { Request, Response } from "express";
import { UserInputRegisterInfoSc } from "../../schemas/user.schema";
import { PrismaClient } from "@prisma/client";
import {
  bad_response,
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";

const prisma = new PrismaClient();

export const FindUserByNameController = (req: Request, res: Response) => {
  try {
    const rawData = req.body;
    const parsedData = UserInputRegisterInfoSc.parse(rawData);

    const user = prisma.user.findUnique({
      where: {
        username: parsedData.name,
      },
    });

    if (!user) {
      return res.status(200).json(
        good_response({
          data: {},
          message: "Usuario no encontrado",
        })
      );
    }
    return res.status(200).json(
      good_response({
        data: { ...user },
        message: "Usuario encontrado",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });
    if (zod_error?.error)
      return res
        .status(400)
        .json(
          error_response({ data: { error: error, message: zod_error.error } })
        );

    return res.status(500).json(
      bad_response({
        data: {
          message: "error en el servidor",
          error: error,
        },
      })
    );
  }
};
