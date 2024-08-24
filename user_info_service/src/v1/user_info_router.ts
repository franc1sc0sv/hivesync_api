import { Router } from "express";
import {
  FindUserByNameControllerForFriends,
  GetUserDataByID,
  post_user_info,
} from "../controllers/user_info/user_info_controller";
import { auth_middleware } from "../middleware/auth";
const user_info_router = Router();

user_info_router.route("/").post(post_user_info);

user_info_router.route("/:id").get(GetUserDataByID);

user_info_router
  .route("/friends")
  .post([auth_middleware, FindUserByNameControllerForFriends]);

export default user_info_router;
