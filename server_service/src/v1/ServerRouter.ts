import { Router } from "express";
import {
  CreateServer,
  DeleteServer,
  EditInfoServer,
  editServerName,
  editBackgroundColor,
  GetAllServersByUser,
  GetBasicDataFromSpecificServer,
  GetDataFromSpecificServer,
} from "../controllers/ServerController";
import { auth_middleware } from "../middleware/auth";
import { IsServerAdmin } from "../middleware/IsServerAdmin";

const ServerRouter = Router();

ServerRouter.route("/")
  .get([auth_middleware, GetAllServersByUser])
  .post([auth_middleware, CreateServer]);

ServerRouter.route("/:id")
  .get([auth_middleware, IsServerAdmin, GetDataFromSpecificServer])
  .delete([auth_middleware, IsServerAdmin, DeleteServer])
  .patch([auth_middleware, IsServerAdmin, EditInfoServer]);

ServerRouter.route("/edit/name/:id").patch([auth_middleware, IsServerAdmin, editServerName]);
ServerRouter.route("/edit/cover/:id").patch([auth_middleware, IsServerAdmin, editBackgroundColor]);


ServerRouter.route("/basic/:id").get([
  auth_middleware,
  IsServerAdmin,
  GetBasicDataFromSpecificServer,
]);
export default ServerRouter;
