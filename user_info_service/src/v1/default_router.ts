import { Router } from "express";
import { base_route } from "../controllers/default/default_controller";

const default_router = Router();

default_router.route("/").get(base_route);

export default default_router;
