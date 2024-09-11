import { Server as SocketIOServer, Socket } from "socket.io";
import { deleteData, headers_by_json, postData } from "./http_request";
import { AxiosChannelService } from "../config/axios";
import { get_data_user } from "./get_data_user";

export const setupSocketIO = (io: SocketIOServer) => {
  const chatNamespace = io.of("/chat");

  chatNamespace.on("connection", (socket: Socket) => {
    socket.on("join_room", async (room: string) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on("send_message", async (data: any) => {
      io.to(data.id_room).emit("receive_message", data.message);
    });
  });

  const callNamespace = io.of("/call");

  callNamespace.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinCall", async ({ roomId, userId, peerId }) => {
      socket.join(roomId);
      console.log(`User ${userId} joined call ${roomId}`);

      const user_data = await get_data_user(userId);
      const data = {
        roomId: roomId,
        participants: [userId],
      };

      try {
        await postData({
          AxiosConfig: AxiosChannelService,
          data: data,
          url: "/calls",
          headers: headers_by_json({ data: { ...user_data } }),
        });
      } catch (error: any) {
        console.log(error.response.data);
      }

      socket.to(roomId).emit("new_peer", { userId, peerId });
    });

    socket.on("leaveCall", async ({ roomId, userId }) => {
      socket.leave(roomId);
      console.log(`User ${userId} left call ${roomId}`);

      const user_data = await get_data_user(userId);
      console.log(userId);
      try {
        await deleteData({
          AxiosConfig: AxiosChannelService,
          id: roomId,
          url: "/calls",
          headers: headers_by_json({ data: { ...user_data } }),
        });
      } catch (error: any) {
        console.log(error);
      }

      // Inform other users in the room about the user leaving
      socket.to(roomId).emit("peer_left", userId);
    });

    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
