import { Router } from "express";
import { auth_middleware } from "../middleware/auth";
import {
  AcceptCall,
  CreateCall,
  EndCall,
  GetCall,
  updateParticipantStatus,
} from "../controllers/CalllsControllers";

const CallsRouter = Router();

CallsRouter.route("/").post([auth_middleware, CreateCall]);

CallsRouter.route("/:id").get([auth_middleware, GetCall]);

CallsRouter.route("/accept/:id").patch([auth_middleware, AcceptCall]);

CallsRouter.route("/end/:id").patch([auth_middleware, EndCall]);

CallsRouter.route("/status/:id").patch([
  auth_middleware,
  updateParticipantStatus,
]);

export default CallsRouter;
