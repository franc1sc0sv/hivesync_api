import { Response } from "express";
import RequestWithUser from "../interfaces/auth_interface";
import { PrismaClient } from "@prisma/client";
import {
  CreateServerSchema,
  EditInfoServerSchema,
} from "../schemas/serverSchemas";
import {
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";
import { ZodError } from "zod";
import RequestServer from "../interfaces/RequestWithServer";

const prisma = new PrismaClient();

export const CreateServer = async (req: RequestWithUser, res: Response) => {
  try {
    const validatedData = CreateServerSchema.parse(req.body);

    const server = await prisma.servers.create({
      data: {
        name: validatedData.name,
        avatarURL: validatedData.avatarURL ?? "",
        id_user: req.user?.id as string,
        privacity: validatedData.privacity,
        tags: {
          connect: validatedData.tags?.map((tagId) => ({ id: tagId })),
        },
      },
    });

    return res.status(201).json(
      good_response({
        data: server,
        message: "Servidor creado con éxito",
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
        message: "Error creando el servidor",
      })
    );
  }
};

export const DeleteServer = async (req: RequestServer, res: Response) => {
  try {
    await prisma.servers.delete({
      where: { id: req.server?.id },
    });

    return res.status(200).json(
      good_response({
        message: "Servidor eliminado con éxito",
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
        message: "Error eliminando el servidor",
      })
    );
  }
};

export const EditInfoServer = async (req: RequestServer, res: Response) => {
  try {
    const validatedData = EditInfoServerSchema.parse(req.body);

    const updatedServer = await prisma.servers.update({
      where: { id: req.server?.id },
      data: {
        name: validatedData.name,
        privacity: validatedData.privacity,
      },
    });

    return res.status(200).json(
      good_response({
        data: updatedServer,
        message: "Información del servidor actualizada con éxito",
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
        message: "Error actualizando la información del servidor",
      })
    );
  }
};

export const GetAllServersByUser = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const servers = await prisma.servers.findMany({
      where: {
        id_user: req.user?.id as string,
      },
    });

    return res.status(200).json(
      good_response({
        data: servers,
        message: "Lista de servidores obtenida con éxito",
      })
    );
  } catch (error) {
    return res.status(500).json(
      error_response({
        data: { error: error },
        message: "Error obteniendo la lista de servidores",
      })
    );
  }
};

export const GetDataFromSpecificServer = async (
  req: RequestServer,
  res: Response
) => {
  try {
    const id_server = req.server?.id;
    const server = await prisma.servers.findUnique({
      where: { id: id_server },
      include: {
        tags: true,
        categories: true,
        events: true,
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json(
        error_response({
          data: { message: "Servidor no encontrado" },
        })
      );
    }

    return res.status(200).json(
      good_response({
        data: server,
        message: "Datos del servidor obtenidos con éxito",
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
        message: "Error obteniendo los datos del servidor",
      })
    );
  }
};
