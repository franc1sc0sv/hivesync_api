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
import { IsServerAdminOrMember } from "../middleware/IsServerAdminOrMember";

const ServerRouter = Router();

ServerRouter.route("/")
  .get([auth_middleware, GetAllServersByUser])
  .post([auth_middleware, CreateServer]);

ServerRouter.route("/:id")
  .get([auth_middleware, IsServerAdminOrMember, GetDataFromSpecificServer])
  .delete([auth_middleware, IsServerAdmin, DeleteServer])
  .patch([auth_middleware, IsServerAdmin, EditInfoServer]);

ServerRouter.route("/edit/name/:id").patch([auth_middleware, IsServerAdmin, editServerName]);
ServerRouter.route("/edit/cover/:id").patch([auth_middleware, IsServerAdmin, editBackgroundColor]);


ServerRouter.route("/basic/:id").get([
  auth_middleware,
  IsServerAdminOrMember,
  GetBasicDataFromSpecificServer,
]);
export default ServerRouter;
