import { Router } from "express";
import {
  AcceptFriendRequest,
  DeleteFriend,
  GetFriendsByUser,
} from "../controllers/FriendsController";
import { auth_middleware } from "../middleware/auth";

const FriendsRouter = Router();

FriendsRouter.route("/")
  .post([auth_middleware, AcceptFriendRequest])
  .delete([auth_middleware, DeleteFriend]);

FriendsRouter.route("/:id").get([auth_middleware, GetFriendsByUser]);

export default FriendsRouter;
