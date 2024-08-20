import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import RequestWithUser from "../interfaces/auth_interface";
import { CreateNotificationSchema } from "../schemas/NotificationsSchema";

import {
  bad_response,
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export const CreateNotification = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const validatedData = CreateNotificationSchema.parse(req.body);

    const newNotification = await prisma.notification.create({
      data: {
        message: validatedData.message,
        category: validatedData.category,
        json_data: validatedData.json_data,
        to_user_id: validatedData.to_user_id,
      },
    });

    return res.status(201).json(
      good_response({
        data: newNotification,
        message: "Notificación creada con éxito",
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
        data: { error: error, message: "Error creando la notificación" },
      })
    );
  }
};

export const GetAllNotificationsByUser = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const userId = req.user?.id as string;

    const notifications = await prisma.notification.findMany({
      where: { to_user_id: userId },
    });

    return res.status(200).json(
      good_response({
        data: notifications,
        message: "Notificaciones obtenidas con éxito",
      })
    );
  } catch (error) {
    return res.status(500).json(
      error_response({
        data: { error: error, message: "Error obteniendo las notificaciones" },
      })
    );
  }
};

export const DeleteNotification = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const notification_id = req.params.id;

    if (!notification_id) {
      return res.status(404).json(
        bad_response({
          data: { message: "Notificación no encontrada" },
        })
      );
    }
    const notificationToDelete = await prisma.notification.findUnique({
      where: { id: notification_id },
    });

    if (!notificationToDelete) {
      return res.status(404).json(
        bad_response({
          data: { message: "Notificación no encontrada" },
        })
      );
    }

    await prisma.notification.delete({
      where: { id: notification_id },
    });

    return res.status(200).json(
      good_response({
        data: {},
        message: "Notificación eliminada con éxito",
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
        data: { error: error, message: "Error eliminando la notificación" },
      })
    );
  }
};

export const DeleteAllNotifications = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    await prisma.notification.deleteMany({
      where: { to_user_id: req.user?.id },
    });

    return res.status(200).json(
      good_response({
        data: {},
        message: "Notificaciónes eliminada con éxito",
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
        data: { error: error, message: "Error eliminando la notificación" },
      })
    );
  }
};
