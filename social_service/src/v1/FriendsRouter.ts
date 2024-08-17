import { Router } from "express";
import {
  DeleteFriend,
  GetFriendsByUser,
} from "../controllers/FriendsController";
import { auth_middleware } from "../middleware/auth";

const FriendsRouter = Router();

FriendsRouter.route("/").delete([auth_middleware, DeleteFriend]);

FriendsRouter.route("/:id").get([auth_middleware, GetFriendsByUser]);

export default FriendsRouter;
