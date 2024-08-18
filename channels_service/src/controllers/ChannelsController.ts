import { Response } from "express";
import RequestServer from "../interfaces/RequestWithServer";
import {
  CreateChannelSchema,
  CreateManyChannelsSchema,
  DeleteChannelSchema,
  EditChannelSchema,
  GetChannelFromServerSchema,
} from "../schemas/ChannelSchemas";
import {
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";
import { PrismaClient } from "@prisma/client";
import { ZodError } from "zod";

const prisma = new PrismaClient();
export const CreateChannel = async (req: RequestServer, res: Response) => {
  try {
    const validatedData = CreateChannelSchema.parse(req.body);
    const id_server = req.server?.id;

    const existingChannel = await prisma.channels.findFirst({
      where: {
        name: validatedData.name,
        ServerID: id_server as string,
      },
    });

    if (existingChannel) {
      return res.status(400).json(
        error_response({
          data: {},
          message: "El nombre del canal ya está en uso en este servidor.",
        })
      );
    }

    const channel = await prisma.channels.create({
      data: {
        ...validatedData,
        ServerID: id_server as string,
      },
    });

    return res.status(201).json(
      good_response({
        data: channel,
        message: "Canal creado con éxito",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });

    if (error instanceof ZodError) {
      return res.status(400).json(
        error_response({
          data: { error: error, message: zod_error?.error },
        })
      );
    }
    return res.status(500).json(
      error_response({
        data: { error: error },
        message: "Error creando el canal",
      })
    );
  }
};

export const CreateManyChannels = async (req: RequestServer, res: Response) => {
  try {
    const validatedData = CreateManyChannelsSchema.parse(req.body);
    const id_server = req.server?.id;

    const channelNames = validatedData.map((channel) => channel.name);

    const existingChannels = await prisma.channels.findMany({
      where: {
        name: {
          in: channelNames,
        },
        ServerID: id_server,
      },
      select: { name: true },
    });

    if (existingChannels.length > 0) {
      const existingNames = existingChannels.map((channel) => channel.name);
      return res.status(400).json(
        error_response({
          data: {},
          message: `Los siguientes nombres de canal ya están en uso: ${existingNames.join(
            ", "
          )}`,
        })
      );
    }

    const channels = await prisma.channels.createMany({
      data: validatedData.map((channel) => ({
        ...channel,
        ServerID: id_server as string,
      })),
    });

    return res.status(201).json(
      good_response({
        data: channels,
        message: "Canales creados con éxito",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });

    if (error instanceof ZodError) {
      return res.status(400).json(
        error_response({
          data: { error: error, message: zod_error?.error },
        })
      );
    }
    return res.status(500).json(
      error_response({
        data: { error: error },
        message: "Error creando los canales",
      })
    );
  }
};

export const DeleteChannel = async (req: RequestServer, res: Response) => {
  try {
    const validatedData = DeleteChannelSchema.parse(req.params);

    await prisma.channels.delete({
      where: { id: validatedData.channelId },
    });

    return res.status(200).json(
      good_response({
        data: {},
        message: "Canal eliminado con éxito",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });

    if (error instanceof ZodError) {
      return res.status(400).json(
        error_response({
          data: { error: error, message: zod_error?.error },
        })
      );
    }
    return res.status(500).json(
      error_response({
        data: { error: error },
        message: "Error eliminando el canal",
      })
    );
  }
};

export const EditChannels = async (req: RequestServer, res: Response) => {
  try {
    const validatedData = EditChannelSchema.parse({
      ...req.params,
      ...req.body,
    });

    const existingChannel = await prisma.channels.findFirst({
      where: {
        name: validatedData.name,
        ServerID: validatedData.serverID as string,
      },
    });

    if (existingChannel) {
      return res.status(400).json(
        error_response({
          data: {},
          message: "El nombre del canal ya está en uso en este servidor.",
        })
      );
    }

    const updatedChannel = await prisma.channels.update({
      where: { id: validatedData.channelId },
      data: {
        name: validatedData.name,
        CategoryID: validatedData.CategoryID,
      },
    });

    return res.status(200).json(
      good_response({
        data: updatedChannel,
        message: "Canal actualizado con éxito",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });

    if (error instanceof ZodError) {
      return res.status(400).json(
        error_response({
          data: { error: error, message: zod_error?.error },
        })
      );
    }
    return res.status(500).json(
      error_response({
        data: { error: error },
        message: "Error actualizando el canal",
      })
    );
  }
};

export const GetManyChannelsFromServer = async (
  req: RequestServer,
  res: Response
) => {
  try {
    const id_server = req.server?.id;

    const channels = await prisma.channels.findMany({
      where: { ServerID: id_server },
    });

    return res.status(200).json(
      good_response({
        data: channels,
        message: "Lista de canales obtenida con éxito",
      })
    );
  } catch (error) {
    return res.status(500).json(
      error_response({
        data: { error: error },
        message: "Error obteniendo la lista de canales",
      })
    );
  }
};

export const GetChannelFromServer = async (
  req: RequestServer,
  res: Response
) => {
  try {
    const validatedData = GetChannelFromServerSchema.parse(req.params);

    const channel = await prisma.channels.findUnique({
      where: { id: validatedData.channelId },
    });

    if (!channel) {
      return res.status(404).json(
        error_response({
          data: {},
          message: "Canal no encontrado",
        })
      );
    }

    return res.status(200).json(
      good_response({
        data: channel,
        message: "Canal obtenido con éxito",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });

    if (error instanceof ZodError) {
      return res.status(400).json(
        error_response({
          data: { error: error, message: zod_error?.error },
        })
      );
    }
    return res.status(500).json(
      error_response({
        data: { error: error },
        message: "Error obteniendo el canal",
      })
    );
  }
};
