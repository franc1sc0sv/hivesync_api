import { Response } from "express";
import RequestWithUser from "../interfaces/RequestWithServer";

import {
  bad_response,
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";

import { PrismaClient, CallStatus } from "@prisma/client";

import { CreateCallSchema, AccepCallSchema } from "../schemas/CallsSchema";
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
    });

    return res.status(200).json(
      good_response({
        data: { data: updateCall, message: "Llamada terminado con éxito" },
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

    const newParticipantOnCall = await prisma.callParticipant.create({
      data: { userId: validatedData.participant, callId: updatedCall.id },
    });

    return res.status(200).json(
      good_response({
        data: { ...updatedCall, ...newParticipantOnCall },
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

// export const AddParticipantsToCall = async (
//   req: RequestWithUser,
//   res: Response
// ) => {
//   try {
//     const validatedData = AddParticipantsSchema.parse(req.body);
//     const callId = req.params.callId;

//     const call = await prisma.call.findUnique({
//       where: { id: callId },
//     });

//     if (!call) {
//       return res.status(404).json(
//         error_response({
//           data: {},
//           message: "Llamada no encontrada",
//         })
//       );
//     }

//     const participants = await prisma.callParticipant.createMany({
//       data: validatedData.participants.map((userId) => ({
//         callId,
//         userId,
//       })),
//     });

//     return res.status(200).json(
//       good_response({
//         data: participants,
//         message: "Participantes añadidos con éxito",
//       })
//     );
//   } catch (error) {
//     const zod_error = detect_zod_error({ error });

//     if (error instanceof ZodError) {
//       return res.status(400).json(
//         error_response({
//           data: { error: error, message: zod_error?.error },
//         })
//       );
//     }
//     return res.status(500).json(
//       error_response({
//         data: { error: error },
//         message: "Error añadiendo participantes a la llamada",
//       })
//     );
//   }
// };
