import { Server as SocketIOServer, Socket } from "socket.io";
import { headers_by_json, patchData, postData } from "./http_request";
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
    socket.on(
      "joinCall",
      async ({ roomId, userId, peerId, source }, callback) => {
        socket.join(roomId);

        try {
          const user_data = await get_data_user(userId);

          const data = {
            roomId: roomId,
            participants: [userId],
          };

          const data_accept = {
            participant: userId,
          };
          const call =
            source === "ANSWER"
              ? await acceptCallProcess(user_data, data_accept, roomId)
              : await newCallProcess(user_data, data);
          callback({ call: call });
          socket.to(roomId).emit("new_peer", { userId, call, peerId });
        } catch (error: any) {}
      }
    );

    socket.on("leaveCall", async ({ roomId, userId }) => {
      socket.leave(roomId);

      const user_data = await get_data_user(userId);
      try {
        const call = await patchData({
          data: {},
          AxiosConfig: AxiosChannelService,
          id: roomId,
          url: "/calls/end",
          headers: headers_by_json({ data: { ...user_data } }),
        });
        socket.to(roomId).emit("peer_left", { userId, call });
      } catch (error: any) {}
    });

    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

const newCallProcess = async (user_data: any, data: any) => {
  return await postData({
    AxiosConfig: AxiosChannelService,
    data: data,
    url: "/calls",
    headers: headers_by_json({ data: { ...user_data } }),
  });
};

const acceptCallProcess = async (user_data: any, data: any, roomId: string) => {
  return await patchData({
    AxiosConfig: AxiosChannelService,
    data: data,
    id: roomId,
    url: "/calls/accept",
    headers: headers_by_json({ data: { ...user_data } }),
  });
};
