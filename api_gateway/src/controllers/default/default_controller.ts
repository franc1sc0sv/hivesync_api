import { PrismaClient } from "@prisma/client";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library.js";

import { error_response, good_response } from "../../utlis/api_response_utils";
import { ErrorResponse } from "../../types/api_response";

import { Request, Response } from "express";

const prisma = new PrismaClient();

export const base_route = async (_: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    const data = {
      server: 1,
      db: 1,
    };

    return res
      .status(200)
      .json(good_response({ data, message: "SINCE HIVESYNC GATEWAY" }));
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      const data: ErrorResponse = {
        data: {
          server: 1,
          db: 0,
        },
        error: error,
        message: "Error conectando con la base de datos",
      };
      return res.status(400).json(error_response({ data }));
    }

    const data: ErrorResponse = {
      data: {
        server: 0,
        db: 0,
      },
      error: error,
      message: "Error desconocido del servidor",
    };

    return res.status(500).json(error_response({ data }));
  }
};
