// TagControllers.ts
import { Response } from "express";
import RequestServer from "../interfaces/RequestWithServer";
import { PrismaClient } from "@prisma/client";
import {
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export const CreateTags = async (req: RequestServer, res: Response) => {
  try {
    const tags = req.body;

    const tag = await prisma.tags.createMany({ data: tags });

    return res.status(201).json(
      good_response({
        data: tag,
        message: "Etiquetas creada con éxito",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });

    if (error instanceof ZodError) {
      return res
        .status(400)
        .json(
          error_response({ data: { error: error, message: zod_error?.error } })
        );
    }
    return res.status(500).json(
      error_response({
        data: { error: error },
        message: "Error creando la etiqueta",
      })
    );
  }
};

export const GetAllTagsByServer = async (req: RequestServer, res: Response) => {
  try {
    const serverId = req.params?.id;

    const tags = await prisma.tags.findMany({
      where: { servers: { some: { id: serverId as string } } },
    });

    return res.status(200).json(
      good_response({
        data: tags,
        message: "Lista de etiquetas obtenida con éxito",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });

    if (error instanceof ZodError) {
      return res
        .status(400)
        .json(
          error_response({ data: { error: error, message: zod_error?.error } })
        );
    }
    return res.status(500).json(
      error_response({
        data: { error: error },
        message: "Error obteniendo la lista de etiquetas",
      })
    );
  }
};
