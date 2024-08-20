import { Response } from "express";
import RequestWithUser from "../interfaces/auth_interface";
import {
  AcceptFriendRequestSchema,
  RejectFriendRequestSchema,
  SendFriendRequestSchema,
  SendFriendRequestType,
} from "../schemas/Friends";
import {
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";
import { PrismaClient } from "@prisma/client";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export const CreateRequestController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const validatedData: SendFriendRequestType = SendFriendRequestSchema.parse(
      req.body
    );

    const WhoSentTheRequest = req.user?.id as string;
    const WhoReciveTheRequest = validatedData.WhoReciveTheRequest;

    const existingRequest = await prisma.friensRequests.findFirst({
      where: {
        OR: [
          {
            WhoSentTheRequest: WhoSentTheRequest,
            WhoReciveTheRequest: WhoReciveTheRequest,
          },
          {
            WhoSentTheRequest: WhoReciveTheRequest,
            WhoReciveTheRequest: WhoSentTheRequest,
          },
        ],
      },
    });

    if (existingRequest) {
      return res.status(400).json(
        error_response({
          data: { message: "Ya existe una solicitud" },
          message: "Operacion completada",
        })
      );
    }

    const newRequest = await prisma.friensRequests.create({
      data: {
        WhoSentTheRequest,
        WhoReciveTheRequest,
      },
    });

    return res.status(201).json(
      good_response({
        data: newRequest,
        message: "Solicitud de amistad enviada",
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
        message: "Error enviando solicitud de amistad",
      })
    );
  }
};

export const RejectRequestController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const validatedData = RejectFriendRequestSchema.parse(req.body);

    const request = await prisma.friensRequests.findUnique({
      where: { id: validatedData.requestId },
    });

    if (!request || request.WhoReciveTheRequest !== req.user?.id) {
      return res.status(404).json(
        error_response({
          data: {
            message: "Solicitud de amistad no encontrada o no autorizada",
          },
        })
      );
    }

    await prisma.friensRequests.delete({
      where: { id: validatedData.requestId },
    });

    return res.status(200).json(
      good_response({
        data: { requestId: validatedData.requestId },
        message: "Solicitud de amistad rechazada",
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
        message: "Error rechazando solicitud de amistad",
      })
    );
  }
};

export const AcceptRequestController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const validatedData = AcceptFriendRequestSchema.parse(req.body);

    const friendRequest = await prisma.friensRequests.findUnique({
      where: { id: validatedData.requestId },
    });

    if (!friendRequest || friendRequest.WhoReciveTheRequest !== req.user?.id) {
      return res.status(404).json(
        error_response({
          data: {
            message: "Solicitud de amistad no encontrada o no autorizada",
          },
        })
      );
    }

    const newFriendship = await prisma.friends.create({
      data: {
        friend1: friendRequest.WhoSentTheRequest,
        friend2: friendRequest.WhoReciveTheRequest,
      },
    });

    await prisma.friensRequests.delete({
      where: { id: validatedData.requestId },
    });

    return res.status(201).json(
      good_response({
        data: newFriendship,
        message: "Solicitud de amistad aceptada",
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
        message: "Error aceptando solicitud de amistad",
      })
    );
  }
};
