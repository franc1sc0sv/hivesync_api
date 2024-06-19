import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { createProxyMiddleware } from "http-proxy-middleware";

import default_router from "./v1/default_router";
import auth_router from "./v1/auth_router";

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

const proxyMiddleware = createProxyMiddleware({
  target: "http://hivesync_api-social_service-1:3000/friends",
});

app.use(BASE_URL + "/friends", proxyMiddleware);

app.listen(PORT, () => {
  console.log(`API GATEWAY initialized in ${PORT}`);
});
