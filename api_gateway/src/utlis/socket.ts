import { error_response } from "hivesync_utils";
import { Server as SocketIOServer, Socket } from "socket.io";
import { headers_by_token, postData } from "./http_request";
import { AxiosChannelService } from "../config/axios";

export const setupSocketIO = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_room", async (room: string) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on("send_message", async (data:any) => {
      try {
        console.log("a", data);
        const validatedData = data;
        const res = await postData({
          AxiosConfig: AxiosChannelService,
          data: validatedData,
          url: "/messages",
          headers: headers_by_token({ token: data.token }),
        });
        io.to(res.room).emit("receive_message", res);
        return;
      } catch (error) {
        return error_response({
          data: {
            message: "Ha ocurrido un error",
            error: error,
          },
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
