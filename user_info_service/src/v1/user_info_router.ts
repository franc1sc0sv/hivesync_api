import { Router } from "express";
import { post_user_info } from "../controllers/user_info/user_info_controller";

const user_info_router = Router();

user_info_router.route("/info").post(post_user_info);

export default user_info_router;
