import { Router } from "express";
import { edit_username } from "../controllers/editUserData/edit_username_controller";
import { auth_middleware } from "../middleware/auth";

const edit_user_data_router = Router();

edit_user_data_router.route("/username").patch(auth_middleware(), edit_username);

export default edit_user_data_router;
