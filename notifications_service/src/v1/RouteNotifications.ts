import { Router } from "express";
import { auth_middleware } from "../middleware/auth";

import {
  GetAllNotificationsByUser,
  DeleteAllNotifications,
  CreateNotification,
  DeleteNotification,
} from "../controllers/NotificationsControllers";

const NotificationsRouter = Router();

NotificationsRouter.route("/")
  .get([auth_middleware, GetAllNotificationsByUser])
  .delete([auth_middleware, DeleteAllNotifications])
  .post([auth_middleware, CreateNotification]);

NotificationsRouter.route("/:id").delete([auth_middleware, DeleteNotification]);

export default NotificationsRouter;
