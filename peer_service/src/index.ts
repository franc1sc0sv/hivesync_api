import { PeerServer } from "peer";

const PORT = process.env.DEFAULT_INTERNAL_PORT_PEER || 9001;

PeerServer({ port: PORT as number, path: "/peerjs/myapp" });

console.log(`PEER INITIALIZED AT ${PORT}`);
