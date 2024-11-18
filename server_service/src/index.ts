import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import DefaultRouter from "./v1/DefaultRouter";
import ServerRouter from "./v1/ServerRouter";
import CategoriesRouter from "./v1/CategoriesRouter";
import EventsRouter from "./v1/EventsRouter";
import MembersRouter from "./v1/MembersRouter";

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
app.use(BASE_URL + "/management", ServerRouter);
app.use(BASE_URL + "/categories", CategoriesRouter);
app.use(BASE_URL + "/events", EventsRouter);
app.use(BASE_URL + "/members", MembersRouter);

app.listen(PORT, () => {
  console.log(`SERVER microservice initialized in ${PORT}`);
});

("");
