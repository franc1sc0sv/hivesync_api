import { Router } from "express";

import { auth_middleware } from "../middleware/auth";
import { IsServerAdminOrMember } from "../middleware/IsServerAdminOrMember";
import { IsServerAdmin } from "../middleware/IsServerAdmin";

import {
  AccepInvitationServer,
  AddNewMemberToServer,
  CreateInvitationServer,
  DeleteMemberFromServer,
  GetServerMembersFromServer,
  RejectInvitation,
} from "../controllers/MembersController";

const MembersRouter = Router();

MembersRouter.route("/:id")
  .get([auth_middleware, IsServerAdminOrMember, GetServerMembersFromServer])
  .delete([auth_middleware, IsServerAdmin, DeleteMemberFromServer])
  .post([auth_middleware, IsServerAdminOrMember, AddNewMemberToServer]);

MembersRouter.route("/invitation/create/:id").post([
  auth_middleware,
  IsServerAdminOrMember,
  CreateInvitationServer,
]);

MembersRouter.route("/invitation/accept/:id").patch([
  auth_middleware,
  IsServerAdminOrMember,
  AccepInvitationServer,
]);

MembersRouter.route("/invitation/reject/:id").patch([
  auth_middleware,
  IsServerAdminOrMember,
  RejectInvitation,
]);

export default MembersRouter;
