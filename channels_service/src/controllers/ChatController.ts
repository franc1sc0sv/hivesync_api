import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ZodError } from "zod";
import {
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";
import { messageSchema } from "../schemas/MessahesSchema";
import RequestWithUser from "../interfaces/auth_interface";
import {
  GroupedMessagesType,
  GroupedMessagesTypeArray,
  messages,
} from "../types/messages";
import { getData, headers_by_json } from "../utlis/http_request";
import { AxiosUserInfoService } from "../config/axios";

const prisma = new PrismaClient();

export const SendMessageController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const validatedData = messageSchema.parse(req.body);
    const id_user = req.user?.id as string;

    const message = await prisma.messages.create({
      data: {
        id_sender: id_user,
        message: validatedData.message,
        room: validatedData.room,
      },
    });

    return res.status(200).json(
      good_response({
        data: message,
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
      error_response({
        data: { error: error, message: "Error creando el mensaje" },
      })
    );
  }
};

export const GetMessagesController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const room = req.params.id;

    if (!room) {
      return res.status(400).json(
        error_response({
          data: {
            message: "ID no existe",
          },
        })
      );
    }

    const messages = await prisma.messages.findMany({
      where: { room: room },
    });

    const formatedMessages = groupMessages({ messages: messages });

    const uniqueSenders = Array.from(
      new Set(messages.map((message) => message.id_sender))
    );

    const usersData = await Promise.all(
      uniqueSenders.map(async (id_sender) => {
        const user_data = await getData({
          AxiosConfig: AxiosUserInfoService,
          url: `/user/${id_sender}`,
          headers: headers_by_json({ data: req.user }),
        });
        return { id_sender, user_data: user_data };
      })
    );

    const userDataMap = new Map(
      usersData.map((user) => [user.id_sender, user.user_data])
    );

    const messagesWithUserData = formatedMessages.map((group) => ({
      ...group,
      user: userDataMap.get(group.id_user),
    }));

    console.log(messagesWithUserData);

    return res.status(201).json(
      good_response({
        data: messagesWithUserData,
      })
    );
  } catch (error) {
    return res.status(500).json(
      error_response({
        data: { error: error, message: "Error obteniendo el mensaje" },
      })
    );
  }
};

function groupMessages({
  messages,
}: {
  messages: messages[];
}): GroupedMessagesTypeArray {
  if (messages.length === 0) return [];

  const groupedMessages = [];
  let currentGroup: GroupedMessagesType = {
    id_user: messages[0].id_sender,
    sendAt: messages[0].sendAt,
    messages: [{ id: messages[0].id, message: messages[0].message }],
  };

  for (let i = 1; i < messages.length; i++) {
    const currentMessage = messages[i];
    const previousDate = new Date(currentGroup.sendAt);
    const currentDate = new Date(currentMessage.sendAt);
    const timeDifference =
      (currentDate.getTime() - previousDate.getTime()) / 60000;

    if (
      currentMessage.id_sender === currentGroup.id_user &&
      timeDifference <= 1
    ) {
      currentGroup.messages.push({
        id: currentMessage.id,
        message: currentMessage.message,
      });
    } else {
      groupedMessages.push(currentGroup);
      currentGroup = {
        id_user: currentMessage.id_sender,
        sendAt: currentMessage.sendAt,
        messages: [{ id: currentMessage.id, message: currentMessage.message }],
      };
    }
  }

  groupedMessages.push(currentGroup);

  return groupedMessages;
}
