import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import DefaultRouter from "./v1/DefaultRouter";
import ChannelsRouter from "./v1/ChannelsRouter";

import ChatRouter from "./v1/ChatRouter";
import CallsRouter from "./v1/CallsRouter";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
process.env.TZ = "America/El_Salvador";

const BASE_URL = "/api/v1";
const PORT = process.env.PORT || 3000;

app.get("/", (_, res) => {
  res.redirect(BASE_URL);
});

app.get(BASE_URL + "/", (_, res) => {
  res.redirect(BASE_URL);
});

app.use(BASE_URL, DefaultRouter);
app.use(BASE_URL + "/management", ChannelsRouter);
app.use(BASE_URL + "/messages", ChatRouter);
app.use(BASE_URL + "/calls", CallsRouter);

app.listen(PORT, () => {
  console.log(`CHANNELS microservice initialized in ${PORT}`);
});
