import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import chat_router from "./v1/chat_router";





import default_router from "./v1/default_router";
import auth_router from "./v1/auth_router";
import {
  ChannelsProxyMiddleware,
  FriendsProxyMiddeware,
  ServersProxyMiddleware,
  UserInfoProxyMiddleware,
} from "./middleware/microservices";
import { auth_middleware_microservices } from "./middleware/authForMicroservices";
import { setupSocketIO } from "./utlis/socket";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(express.json());
app.use(cors());
process.env.TZ = "America/El_Salvador";

const PORT = process.env.PORT || 3000;
const BASE_URL = "/api/v1";

// Setup Socket.IO
setupSocketIO(io);

app.get("/", (_, res) => {
  res.redirect(BASE_URL);
});

app.use(BASE_URL, default_router);
app.use(BASE_URL + "/auth", auth_router);

app.use(BASE_URL + "/social", [
  auth_middleware_microservices(),
  FriendsProxyMiddeware,
]);

app.use(BASE_URL + "/user_info", [
  auth_middleware_microservices(),
  UserInfoProxyMiddleware,
]);

app.use(BASE_URL + "/server", [
  auth_middleware_microservices(),
  ServersProxyMiddleware,
]);

app.use(BASE_URL + "/channels", [
  auth_middleware_microservices(),
  ChannelsProxyMiddleware,
]);
// wea
app.use(BASE_URL + "/chat", chat_router);
//aca lo cambie a server pero lo wa subir en una rama nueva mejor, no vaya ser
server.listen(PORT, () => {
  console.log(`API GATEWAY initialized in ${PORT}`);
});
