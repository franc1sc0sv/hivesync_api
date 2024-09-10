import { Server as SocketIOServer, Socket } from "socket.io";

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

  callNamespace.on("connection", (socket) => {
    console.log("Usuario conectado al namespace de llamadas", socket.id);

    socket.on("join-call", async (roomId: string) => {
      socket.join(roomId);
      console.log(`Usuario ${socket.id} se ha unido a la sala ${roomId}`);
    });

    socket.on("offer", (data) => {
      console.log("Oferta recibida:", data);
      socket.to(data.roomId).emit("offer", data.offer);
    });

    socket.on("answer", (data) => {
      console.log("Respuesta recibida:", data);
      socket.to(data.roomId).emit("answer", data.answer);
    });

    socket.on("ice-candidate", (data) => {
      console.log("Candidato ICE recibido:", data);
      socket.to(data.roomId).emit("ice-candidate", data.candidate);
    });
  });
};
