import { Router } from "express";
import {
  CreateServer,
  DeleteServer,
  EditInfoServer,
  GetAllServersByUser,
  GetDataFromSpecificServer,
} from "../controllers/ServerController";
import { auth_middleware } from "../middleware/auth";
import { IsServerAdmin } from "../middleware/IsServerAdmin";

const ServerRouter = Router();

ServerRouter.route("/")
  .get([auth_middleware, GetAllServersByUser])
  .post([auth_middleware, CreateServer])
  .delete([auth_middleware, IsServerAdmin, DeleteServer])
  .patch([auth_middleware, IsServerAdmin, EditInfoServer]);

ServerRouter.route("/specific").get([
  auth_middleware,
  IsServerAdmin,
  GetDataFromSpecificServer,
]);

export default ServerRouter;