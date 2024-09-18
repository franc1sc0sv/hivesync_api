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

    socket.on("send_message", async ({ data }, callback) => {
      try {
        const { roomId, userId, message }: InputDataMessage = data;

        const user_data = await get_data_user(userId);

        const newMessage = await postData({
          AxiosConfig: AxiosChannelService,
          data: {
            message: message,
            room: roomId,
          },
          url: "/messages",
          headers: headers_by_json({ data: user_data }),
        });

        callback({ newMessage: newMessage });
        socket.to(roomId).emit("receive_message", newMessage);
      } catch (error) {
        console.log(error);
      }
    });
  });

  const callNamespace = io.of("/call");

  callNamespace.on("connection", (socket: Socket) => {
    socket.on("joinCall", async ({ data, source }, callback) => {
      try {
        const { IsCameraActive, isMicrofoneActive, roomId, userId }: InputData =
          data;
        socket.join(roomId);

        const user_data = await get_data_user(userId);

        const data_call: Call = {
          roomId: roomId,
          participants: [
            {
              IsCameraActive,
              isMicrofoneActive,
              userId,
            },
          ],
          creator_id: userId,
        };

        const data_accept: AcceptCall = {
          participant: userId,
          IsCameraActive,
          isMicrofoneActive,
        };

        const call =
          source === "ANSWER"
            ? await acceptCallProcess(user_data, data_accept, roomId)
            : await newCallProcess(user_data, data_call);

        console.log(call);

        callback({ call: call });
        socket.to(roomId).emit("new_peer", { call });
      } catch (error: any) {
        console.log(error);
      }
    });

    socket.on("leaveCall", async ({ roomId, userId }, callback) => {
      try {
        socket.leave(roomId);
        const user_data = await get_data_user(userId);
        const call = await patchData({
          data: {},
          AxiosConfig: AxiosChannelService,
          id: roomId,
          url: "/calls/end",
          headers: headers_by_json({ data: { ...user_data } }),
        });
        callback({ call: call });
        socket.to(roomId).emit("peer_left", { userId, call });
      } catch (error: any) {}
    });

    socket.on("updateParams", async ({ data }, callback) => {
      try {
        const { IsCameraActive, isMicrofoneActive, roomId, userId }: InputData =
          data;
        socket.join(roomId);
        const user_data = await get_data_user(userId);

        const participant = await patchData({
          data: {
            isMicrofoneActive: isMicrofoneActive,
            IsCameraActive: IsCameraActive,
          },
          AxiosConfig: AxiosChannelService,
          id: roomId,
          url: "/calls/status",
          headers: headers_by_json({ data: { ...user_data } }),
        });

        callback({ participant });
        socket.to(roomId).emit("newUsersParams", { participant, userId });
      } catch (error) {
        console.log(error);
      }
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

type Call = {
  creator_id: string;
  roomId: string;
  participants: {
    userId: string;
    isMicrofoneActive: boolean;
    IsCameraActive: boolean;
  }[];
};

type AcceptCall = {
  participant: string;
  isMicrofoneActive: boolean;
  IsCameraActive: boolean;
};

type InputData = {
  IsCameraActive: boolean;
  isMicrofoneActive: boolean;
  userId: string;
  roomId: string;
};

type InputDataMessage = {
  message: string;
  userId: string;
  roomId: string;
};
