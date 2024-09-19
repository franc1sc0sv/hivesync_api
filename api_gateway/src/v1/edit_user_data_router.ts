import { Router } from "express";
import { edit_username, edit_username_and_about_me } from "../controllers/editUserData/edit_user_data";
import { auth_middleware } from "../middleware/auth";

const edit_user_data_router = Router();

edit_user_data_router.route("/username").patch(auth_middleware(), edit_username);
edit_user_data_router.route("/username-about/:id").patch(auth_middleware(), edit_username_and_about_me);

export default edit_user_data_router;
