import { Server as SocketIOServer, Socket } from "socket.io";

export const setupSocketIO = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_room", async (room: string) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on("send_message", async (data: any) => {
      io.to(data.id_room).emit("receive_message", data.message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
