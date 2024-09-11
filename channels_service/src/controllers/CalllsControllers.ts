import { Response } from "express";
import RequestWithUser from "../interfaces/RequestWithServer";

import {
  bad_response,
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";

import { PrismaClient, CallStatus } from "@prisma/client";

import {
  CreateCallSchema,
  AddParticipantsSchema,
} from "../schemas/CallsSchema";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export const CreateCall = async (req: RequestWithUser, res: Response) => {
  try {
    const validatedData = CreateCallSchema.parse(req.body);

    const call = await prisma.call.create({
      data: {
        roomId: validatedData.roomId,
        participants: {
          create: validatedData.participants.map((userId: string) => ({
            userId,
          })),
        },
      },
    });

    return res.status(201).json(
      good_response({
        data: call,
        message: "Llamada creada con éxito",
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
      bad_response({
        data: { error: error, message: "Error creando la llamada" },
      })
    );
  }
};

export const GetCall = async (req: RequestWithUser, res: Response) => {
  try {
    const callId = req.params.id;

    const call = await prisma.call.findFirst({
      where: { roomId: callId },
      include: { participants: true },
    });

    if (!call) {
      return res.status(200).json(
        good_response({
          data: {},
        })
      );
    }

    return res.status(200).json(
      good_response({
        data: call,
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
        message: "Error obteniendo la llamada",
      })
    );
  }
};

export const DeleteCall = async (req: RequestWithUser, res: Response) => {
  try {
    const callId = req.params.id;

    await prisma.call.delete({
      where: { roomId: callId },
    });

    return res.status(200).json(
      good_response({
        data: { message: "Llamada eliminada con éxito" },
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
        data: { error: error, message: "Error eliminando la llamada" },
      })
    );
  }
};

export const AcceptCall = async (req: RequestWithUser, res: Response) => {
  try {
    const callId = req.params.id;

    const updatedCall = await prisma.call.update({
      where: { id: callId },
      data: {
        status: CallStatus.IN_PROGRESS,
      },
    });

    return res.status(200).json(
      good_response({
        data: updatedCall,
        message: "Llamada actualizada con éxito",
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
        message: "Error actualizando la llamada",
      })
    );
  }
};

export const AddParticipantsToCall = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const validatedData = AddParticipantsSchema.parse(req.body);
    const callId = req.params.callId;

    const call = await prisma.call.findUnique({
      where: { id: callId },
    });

    if (!call) {
      return res.status(404).json(
        error_response({
          data: {},
          message: "Llamada no encontrada",
        })
      );
    }

    const participants = await prisma.callParticipant.createMany({
      data: validatedData.participants.map((userId) => ({
        callId,
        userId,
      })),
    });

    return res.status(200).json(
      good_response({
        data: participants,
        message: "Participantes añadidos con éxito",
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
        message: "Error añadiendo participantes a la llamada",
      })
    );
  }
};
