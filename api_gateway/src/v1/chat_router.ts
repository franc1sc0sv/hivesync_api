import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/chatController";

const chat_router = Router();

chat_router.route("/send_message").post(sendMessage);
chat_router.route("/messages/:room").get(getMessages);

export default chat_router;
