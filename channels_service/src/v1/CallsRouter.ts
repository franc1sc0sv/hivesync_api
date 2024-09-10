import { Router } from "express";
import { auth_middleware } from "../middleware/auth";
import {
  AcceptCall,
  AddParticipantsToCall,
  CreateCall,
  DeleteCall,
  GetCall,
} from "../controllers/CalllsControllers";

const CallsRouter = Router();

CallsRouter.route("/").post([auth_middleware, CreateCall]);

CallsRouter.route("/:id")
  .post([auth_middleware, GetCall])
  .delete([auth_middleware, DeleteCall]);

CallsRouter.route("/accept/:id").patch([auth_middleware, AcceptCall]);

CallsRouter.route("/add/:id").patch([auth_middleware, AddParticipantsToCall]);

export default CallsRouter;
