import { Router } from "express";
import { auth_middleware } from "../middleware/auth";
import { IsServerAdmin } from "../middleware/isServerAdminExternal";
import {
  CreateChannel,
  CreateManyChannels,
  DeleteChannel,
  EditChannels,
  GetChannelFromServer,
  GetManyChannelsFromServer,
} from "../controllers/ChannelsController";

const ChannelsRouter = Router();

ChannelsRouter.route("/:id")
  .post([auth_middleware, IsServerAdmin, CreateChannel])
  .delete([auth_middleware, IsServerAdmin, DeleteChannel])
  .patch([auth_middleware, IsServerAdmin, EditChannels])
  .get([auth_middleware, IsServerAdmin, GetChannelFromServer]);

ChannelsRouter.route("/many/:id")
  .post([auth_middleware, IsServerAdmin, CreateManyChannels])
  .get([auth_middleware, IsServerAdmin, GetManyChannelsFromServer]);

export default ChannelsRouter;
