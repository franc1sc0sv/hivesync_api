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
  AccepCallSchema,
  ParticipantParamsSchema,
} from "../schemas/CallsSchema";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const CreateCall = async (req: RequestWithUser, res: Response) => {
  try {
    const validatedData = CreateCallSchema.parse(req.body);

    const existingCall = await prisma.call.findFirst({
      where: {
        roomId: validatedData.roomId,
      },
    });

    if (existingCall) {
      if (
        existingCall.status === "IN_PROGRESS" ||
        existingCall.status === "PENDING"
      ) {
        return res.status(200).json(
          good_response({
            data: { message: "Llamada en curso" },
          })
        );
      }

      await prisma.call.delete({ where: { id: existingCall.id } });
    }

    const call = await prisma.call.create({
      data: {
        creator_id: validatedData.creator_id,
        roomId: validatedData.roomId,
        participants: {
          create: validatedData.participants.map((x) => x),
        },
      },
      include: { participants: true },
    });

    return res.status(201).json(
      good_response({
        data: call,
        message: "Llamada creada con éxito",
      })
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.log(error.message);
    }

    const zod_error = detect_zod_error({ error });

    if (error instanceof ZodError) {
      console.log(error.errors);
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
    const room_id = req.params.id;

    const call = await prisma.call.findFirst({
      where: { roomId: room_id },
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

export const EndCall = async (req: RequestWithUser, res: Response) => {
  try {
    const callId = req.params.id;

    const existingCall = await prisma.call.findFirst({
      where: {
        roomId: callId,
      },
      include: { participants: true },
    });

    if (!existingCall) {
      return res.status(200).json(
        good_response({
          data: { message: "No existe una llamada" },
        })
      );
    }

    const user_id = existingCall.participants.filter(
      (participant) => participant.userId === req.user?.id
    )[0].id;

    await prisma.callParticipant.delete({
      where: { id: user_id },
    });

    const callStatus =
      existingCall.participants.length >= 2
        ? CallStatus.PENDING
        : CallStatus.ENDED;

    const updateCall = await prisma.call.update({
      data: {
        status: callStatus,
      },
      where: { roomId: callId },
      include: { participants: true },
    });

    return res.status(200).json(
      good_response({
        data: updateCall,
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });
    console.log(error);
    if (error instanceof ZodError) {
      return res.status(400).json(
        error_response({
          data: { error: error, message: zod_error?.error },
        })
      );
    }
    return res.status(500).json(
      bad_response({
        data: { error: error, message: "Error terminando la llamada" },
      })
    );
  }
};

export const AcceptCall = async (req: RequestWithUser, res: Response) => {
  try {
    const callId = req.params.id;
    const validatedData = AccepCallSchema.parse(req.body);

    const existingCall = await prisma.call.findFirst({
      where: {
        AND: [{ roomId: callId }, { status: "PENDING" }],
      },
    });

    if (!existingCall) {
      return res.status(200).json(
        good_response({
          data: { message: "No existe una llamada en curso" },
        })
      );
    }

    const updatedCall = await prisma.call.update({
      where: { id: existingCall.id },
      data: {
        status: CallStatus.IN_PROGRESS,
      },
    });

    await prisma.callParticipant.create({
      data: {
        userId: validatedData.participant,
        callId: updatedCall.id,
        IsCameraActive: validatedData.IsCameraActive,
        isMicrofoneActive: validatedData.isMicrofoneActive,
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

    if (error instanceof PrismaClientKnownRequestError) {
      console.log(error.message);
    }

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

export const updateParticipantStatus = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const callId = req.params.id;
    const validatedData = ParticipantParamsSchema.parse(req.body);

    const existingParticipant = await prisma.callParticipant.findFirst({
      where: {
        AND: [{ callId: callId, userId: req.user?.id }],
      },
    });

    if (!existingParticipant) {
      return res.status(200).json(
        good_response({
          data: { message: "No existe" },
        })
      );
    }

    const updatedParticipantOnCall = await prisma.callParticipant.update({
      where: { id: existingParticipant.id },
      data: {
        IsCameraActive: validatedData.IsCameraActive,
        isMicrofoneActive: validatedData.isMicrofoneActive,
      },
    });

    return res.status(200).json(
      good_response({
        data: { ...updatedParticipantOnCall },
        message: "Estados Actualizados con exito",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });

    if (error instanceof PrismaClientKnownRequestError) {
      console.log(error.message);
    }

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
