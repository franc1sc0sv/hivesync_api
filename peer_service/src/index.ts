import { PeerServer } from "peer";

const PORT = process.env.DEFAULT_INTERNAL_PORT_PEER || 9001;

const peerServer = PeerServer({
  port: PORT as number,
  path: "/peerjs/myapp",
});

peerServer.on("connection", (client) => {
  console.log(`Peer client connected: ${client.getId()}`);
});

peerServer.on("disconnect", (client) => {
  console.log(`Peer client disconnected: ${client.getId()}`);
});

console.log(`PeerJS server running on port ${PORT}`);

("");
