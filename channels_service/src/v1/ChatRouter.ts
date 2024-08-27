import { Router } from "express";
import {
  GetMessagesController,
  SendMessageController,
} from "../controllers/ChatController";
import { auth_middleware } from "../middleware/auth";

const ChatRouter = Router();

ChatRouter.route("/").post([auth_middleware, SendMessageController]);
ChatRouter.route("/:id").get([auth_middleware, GetMessagesController]);

export default ChatRouter;
