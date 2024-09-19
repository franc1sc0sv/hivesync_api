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
import { getData, headers_by_json } from "../utlis/http_request";
import { AxiosUserInfoService } from "../config/axios";

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

    const ParticipantsWithUserData = await Promise.all(
      call.participants.map(async (participant) => {
        const user_data = await getData({
          AxiosConfig: AxiosUserInfoService,
          url: `/user/${participant.userId}`,
          headers: headers_by_json({ data: req.user }),
        });
        return { ...participant, user: user_data };
      })
    );

    const newCall = { ...call, participants: [...ParticipantsWithUserData] };
    console.log(newCall);
    return res.status(201).json(
      good_response({
        data: newCall,
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

    const ParticipantsWithUserData = await Promise.all(
      call.participants.map(async (participant) => {
        const user_data = await getData({
          AxiosConfig: AxiosUserInfoService,
          url: `/user/${participant.userId}`,
          headers: headers_by_json({ data: req.user }),
        });
        return { ...participant, user: user_data };
      })
    );

    const newCall = { ...call, participants: [...ParticipantsWithUserData] };

    return res.status(200).json(
      good_response({
        data: newCall,
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

    const newUpdatedCall = await prisma.call.findFirst({
      where: {
        roomId: callId,
      },
      include: { participants: true },
    });

    let callStatus;

    if (newUpdatedCall?.participants.length === 0) {
      callStatus = CallStatus.ENDED;
    } else if (newUpdatedCall?.participants.length === 1) {
      callStatus = CallStatus.PENDING;
    } else {
      callStatus = CallStatus.IN_PROGRESS;
    }

    const updateCall = await prisma.call.update({
      data: {
        status: callStatus,
      },
      where: { roomId: callId },
      include: { participants: true },
    });

    const ParticipantsWithUserData = await Promise.all(
      updateCall.participants.map(async (participant) => {
        const user_data = await getData({
          AxiosConfig: AxiosUserInfoService,
          url: `/user/${participant.userId}`,
          headers: headers_by_json({ data: req.user }),
        });
        return { ...participant, user: user_data };
      })
    );

    const newCall = {
      ...updateCall,
      participants: [...ParticipantsWithUserData],
    };

    return res.status(200).json(
      good_response({
        data: newCall,
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
        AND: [{ roomId: callId }],
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

    const isUserOnCall = await prisma.callParticipant.findFirst({
      where: { callId: updatedCall.id, userId: validatedData.participant },
    });

    if (isUserOnCall) {
      return res.status(200).json(
        good_response({
          data: { message: "Ya estas en la llamada" },
        })
      );
    }

    await prisma.callParticipant.create({
      data: {
        userId: validatedData.participant,
        callId: updatedCall.id,
        IsCameraActive: validatedData.IsCameraActive,
        isMicrofoneActive: validatedData.isMicrofoneActive,
      },
    });

    const call = await prisma.call.findFirst({
      where: { id: updatedCall.id },
      include: { participants: true },
    });

    if (!call) {
      return res.status(200).json(
        good_response({
          data: { message: "No existe una llamada en curso" },
        })
      );
    }

    const ParticipantsWithUserData = await Promise.all(
      call.participants.map(async (participant) => {
        const user_data = await getData({
          AxiosConfig: AxiosUserInfoService,
          url: `/user/${participant.userId}`,
          headers: headers_by_json({ data: req.user }),
        });
        return { ...participant, user: user_data };
      })
    );

    const newCall = {
      ...call,
      participants: [...ParticipantsWithUserData],
    };

    return res.status(200).json(
      good_response({
        data: newCall,
        message: "Llamada actualizada con éxito",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });
    console.log(error);

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
