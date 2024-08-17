import { Router } from "express";
import {
  AcceptRequestController,
  CreateRequestController,
  RejectRequestController,
} from "../controllers/RequestController";
import { auth_middleware } from "../middleware/auth";

const FriendRequestRouter = Router();

FriendRequestRouter.route("/")
  .post([auth_middleware, CreateRequestController])
  .delete([auth_middleware, RejectRequestController]);

FriendRequestRouter.route("/accept").post([
  auth_middleware,
  AcceptRequestController,
]);

export default FriendRequestRouter;
