import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { content, room, userId } = req.body;

    // Save message to the database
    const message = await prisma.message.create({
      data: {
        content,
        room,
        userId,
      },
    });

    return res.status(200).json({ message });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { room } = req.params;

    // Get messages from the database
    const messages = await prisma.message.findMany({
      where: {
        room,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
