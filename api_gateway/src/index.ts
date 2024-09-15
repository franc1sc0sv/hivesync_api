import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

import default_router from "./v1/default_router";
import auth_router from "./v1/auth_router";
import edit_user_data_router from "./v1/edit_user_data_router";
import {
  ChannelsProxyMiddleware,
  FriendsProxyMiddeware,
  NotificationsProxyMiddleware,
  ServersProxyMiddleware,
  UserInfoProxyMiddleware,
} from "./middleware/microservices";
import { auth_middleware_microservices } from "./middleware/authForMicroservices";

import { setupSocketIO } from "./utlis/socket";

dotenv.config();
const app = express();

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(cors());
process.env.TZ = "America/El_Salvador";

const PORT = process.env.PORT || 3000;
const BASE_URL = "/api/v1";

setupSocketIO(io);

app.get("/", (_, res) => {
  res.redirect(BASE_URL);
});

app.use(BASE_URL, default_router);
app.use(BASE_URL + "/auth", auth_router);
app.use(BASE_URL + "/edit", edit_user_data_router);

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

app.use(BASE_URL + "/notifications", [
  auth_middleware_microservices(),
  NotificationsProxyMiddleware,
]);

server.listen(PORT, () => {
  console.log(`API GATEWAY initialized in ${PORT}`);
});
