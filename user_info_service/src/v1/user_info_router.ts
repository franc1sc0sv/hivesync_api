import { Router } from "express";
import {
  FindUserByNameControllerForFriends,
  GetFriendData,
  GetFriendsDataByUser,
  GetUserDataByID,
  post_user_info,
} from "../controllers/user_info/user_info_controller";

import { edit_username } from "../controllers/user_info/edit_user_info_controller";
import { auth_middleware } from "../middleware/auth";
const user_info_router = Router();

user_info_router
  .route("/friends")
  .post([auth_middleware, FindUserByNameControllerForFriends])
  .get([auth_middleware, GetFriendsDataByUser]);

user_info_router.route("/friends/:id").get([auth_middleware, GetFriendData]);

user_info_router.route("/").post(post_user_info);

user_info_router.route("/:id").get(GetUserDataByID);

//edit user data
user_info_router.route("/edit/username/:id").patch(auth_middleware,edit_username);


export default user_info_router;
