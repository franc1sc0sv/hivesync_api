import { Response } from "express";
import RequestWithUser from "../interfaces/auth_interface";
import { Categories, PrismaClient } from "@prisma/client";
import {
  CreateServerSchema,
  EditInfoServerSchema,
} from "../schemas/serverSchemas";
import {
  bad_response,
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";
import { ZodError } from "zod";
import RequestServer from "../interfaces/RequestWithServer";

import { v4 as uuidv4 } from "uuid";
import { getData, headers_by_json, postData } from "../utlis/http_request";
import { AxiosChannelsService } from "../../config/axios";
import { ChannelsType } from "../types/channels";
import { ChannelTypeEnum } from "../enums/ChannelType";

const prisma = new PrismaClient();

export const CreateServer = async (req: RequestWithUser, res: Response) => {
  try {
    const validatedData = CreateServerSchema.parse(req.body);

    const existingServer = await prisma.servers.findFirst({
      where: {
        name: validatedData.name,
      },
    });

    if (existingServer) {
      return res.status(400).json(
        bad_response({
          data: { message: "El nombre del servidor ya está en uso" },
          message: "Error creando el server",
        })
      );
    }

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

    const ServerCategories: Categories[] = [
      { id: uuidv4(), name: "Canales de voz", serverId: server.id },
      { id: uuidv4(), name: "Canales de texto", serverId: server.id },
    ];

    await prisma.categories.createMany({
      data: ServerCategories,
    });

    const ServerChannels: ChannelsType[] = [
      {
        id: uuidv4(),
        CategoryID: ServerCategories[1].id,
        name: "general",
        ServerID: server.id,
        type: ChannelTypeEnum.VIDEO,
      },
      {
        id: uuidv4(),
        CategoryID: ServerCategories[1].id,
        name: "general",
        ServerID: server.id,
        type: ChannelTypeEnum.TEXT,
      },
    ];

    await postData({
      AxiosConfig: AxiosChannelsService,
      data: ServerChannels,
      url: `/management/many/${server.id}`,
      headers: headers_by_json({ data: req.user }),
    });

    const serverURL = `/app/${server.id}/${ServerChannels[0].id}`;

    return res.status(201).json(
      good_response({
        data: { url: serverURL },
        message: "Servidor creado con éxito",
      })
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const zod_error = detect_zod_error({ error });

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
        data: {},
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
    const server = await prisma.servers.findFirst({
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

    const channels = await getData({
      AxiosConfig: AxiosChannelsService,
      url: `/management/many/${server.id}`,
      headers: headers_by_json({ data: req?.user }),
    });

    return res.status(200).json(
      good_response({
        data: { ...server, channels: [...channels] },
        message: "Datos del servidor obtenidos con éxito",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });
    console.log(error);
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

export const GetBasicDataFromSpecificServer = async (
  req: RequestServer,
  res: Response
) => {
  try {
    const id_server = req.server?.id;
    const server = await prisma.servers.findFirst({
      where: { id: id_server },
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
    console.log(error);
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
