import { Server as SocketIOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const setupSocketIO = (io: SocketIOServer) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_room", async (room: string) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on("send_message", async (message: { room: string; content: string; userId: string }) => {
      const { room, content, userId } = message;

      // Save message to the database
      await prisma.message.create({
        data: {
          content,
          userId,
          room,
        },
      });

      // Broadcast message to the room
      io.to(room).emit("receive_message", { content, userId, timestamp: new Date() });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
