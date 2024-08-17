import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import default_router from "./v1/default_router";
import auth_router from "./v1/auth_router";
import {
  FriendsProxyMiddeware,
  ServersProxyMiddleware,
  UserInfoProxyMiddleware,
} from "./middleware/microservices";
import { auth_middleware_microservices } from "./middleware/authForMicroservices";

dotenv.config();
const app = express();

//Config
app.use(express.json());
app.use(cors());
process.env.TZ = "America/El_Salvador";

const PORT = process.env.PORT || 3000;

const BASE_URL = "/api/v1";

//routes
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

app.listen(PORT, () => {
  console.log(`API GATEWAY initialized in ${PORT}`);
});
