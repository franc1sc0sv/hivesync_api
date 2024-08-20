import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import default_router from "./v1/default_router";
import user_info_router from "./v1/user_info_router";

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
app.use(BASE_URL + "/user", user_info_router);

app.listen(PORT, () => {
  console.log(`USER-INFO_SERVICE initialized in ${PORT}`);
});
