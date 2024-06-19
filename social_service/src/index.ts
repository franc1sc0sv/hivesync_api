import express from "express";
import dotenv from "dotenv";
import cors from "cors";

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
  res.send("Hi from social service");
});

app.listen(PORT, () => {
  console.log(`SOCIAL microservice initialized in ${PORT}`);
});
