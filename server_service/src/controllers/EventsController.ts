import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  CreateEventSchema,
  EditEventSchema,
  GetEventFromServerSchema,
} from "../schemas/eventSchemas";
import {
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";
import { ZodError } from "zod";
import RequestServer from "../interfaces/RequestWithServer";

const prisma = new PrismaClient();

export const CreateEvent = async (req: RequestServer, res: Response) => {
  try {
    const validatedData = CreateEventSchema.parse(req.body);
    const serverId = req.server?.id as string;

    const event = await prisma.event.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        date: validatedData.date,
        serverId: serverId,
      },
    });

    return res.status(201).json(
      good_response({
        data: event,
        message: "Evento creado con éxito",
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
        message: "Error creando el evento",
      })
    );
  }
};

export const DeleteEvent = async (req: RequestServer, res: Response) => {
  try {
    const id_server = req.server?.id;
    await prisma.event.delete({
      where: { id: id_server },
    });

    return res.status(200).json(
      good_response({
        message: "Evento eliminado con éxito",
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
        message: "Error eliminando el evento",
      })
    );
  }
};

export const EditEvent = async (req: RequestServer, res: Response) => {
  try {
    const validatedData = EditEventSchema.parse(req.body);
    const id_server = req.server?.id as string;

    const updatedEvent = await prisma.event.update({
      where: { id: id_server },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        date: validatedData.date,
        serverId: id_server,
      },
    });

    return res.status(200).json(
      good_response({
        data: updatedEvent,
        message: "Evento actualizado con éxito",
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
        message: "Error actualizando el evento",
      })
    );
  }
};

export const GetAllEventsFromServer = async (
  req: RequestServer,
  res: Response
) => {
  try {
    const serverId = req.server?.id as string;

    const events = await prisma.event.findMany({
      where: { serverId: serverId },
    });

    return res.status(200).json(
      good_response({
        data: events,
        message: "Lista de eventos obtenida con éxito",
      })
    );
  } catch (error) {
    return res.status(500).json(
      error_response({
        data: { error: error },
        message: "Error obteniendo la lista de eventos",
      })
    );
  }
};

export const GetEventFromServer = async (req: RequestServer, res: Response) => {
  try {
    const validatedData = GetEventFromServerSchema.parse(req.params);
    const serverId = req.server?.id;

    const event = await prisma.event.findFirst({
      where: {
        id: validatedData.eventId,
        serverId: serverId as string,
      },
    });

    if (!event) {
      return res.status(404).json(
        error_response({
          data: {},
          message: "Evento no encontrado",
        })
      );
    }

    return res.status(200).json(
      good_response({
        data: event,
        message: "Evento obtenido con éxito",
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
        message: "Error obteniendo el evento",
      })
    );
  }
};
