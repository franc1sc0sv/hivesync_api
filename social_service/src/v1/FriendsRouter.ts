import { Router } from "express";
import {
  DeleteFriend,
  GetFriendsByUser,
  HasAnyRequestOrIsFriendAlready,
} from "../controllers/FriendsController";
import { auth_middleware } from "../middleware/auth";

const FriendsRouter = Router();

FriendsRouter.route("/")
  .delete([auth_middleware, DeleteFriend])
  .get([auth_middleware, GetFriendsByUser]);

FriendsRouter.route("/verify_friends/:id").post([
  auth_middleware,
  HasAnyRequestOrIsFriendAlready,
]);

export default FriendsRouter;
