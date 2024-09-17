import { Router } from "express";
import { auth_middleware } from "../middleware/auth";
import { IsServerAdmin } from "../middleware/isServerAdminExternal";
import {
  CreateChannel,
  CreateManyChannels,
  DeleteChannel,
  DeleteManyChannels,
  EditChannels,
  GetChannelFromServer,
  GetManyChannelsFromServer,
} from "../controllers/ChannelsController";
import { IsServerAdminOrMemberExternal } from "../middleware/isServerAdminOMemberExternal";

const ChannelsRouter = Router();

ChannelsRouter.route("/:id")
  .post([auth_middleware, IsServerAdmin, CreateChannel])
  .delete([auth_middleware, IsServerAdmin, DeleteChannel])
  .patch([auth_middleware, IsServerAdmin, EditChannels])
  .get([auth_middleware, IsServerAdminOrMemberExternal, GetChannelFromServer]);

ChannelsRouter.route("/many/:id")
  .post([auth_middleware, IsServerAdmin, CreateManyChannels])
  .get([
    auth_middleware,
    IsServerAdminOrMemberExternal,
    GetManyChannelsFromServer,
  ])
  .delete([auth_middleware, DeleteManyChannels]);

export default ChannelsRouter;
