import express from "express";
import dotenv from "dotenv";

import default_router from "./v1/default_router";
import auth_router from "./v1/auth_router";

dotenv.config();
const app = express();

//Config
app.use(express.json());
process.env.TZ = "America/El_Salvador";

const PORT = process.env.PORT || 3000;

const BASE_URL = "/api/v1";

//routes
app.use(BASE_URL, default_router);
app.use(BASE_URL + "/auth", auth_router);

app.listen(PORT, () => {
  console.log(`API GATEWAY initialized in ${PORT}`);
});
