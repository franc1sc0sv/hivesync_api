import { Router } from "express";
import { auth_middleware } from "../middleware/auth";
import { IsServerAdmin } from "../middleware/IsServerAdmin";
import {
  CreateEvent,
  DeleteEvent,
  EditEvent,
  GetAllEventsFromServer,
  GetEventFromServer,
} from "../controllers/EventsController";

const EventsRouter = Router();

EventsRouter.route("/")
  .get([auth_middleware, IsServerAdmin, GetAllEventsFromServer])
  .post([auth_middleware, IsServerAdmin, CreateEvent])
  .delete([auth_middleware, IsServerAdmin, DeleteEvent])
  .patch([auth_middleware, IsServerAdmin, EditEvent]);

EventsRouter.route("/:id").get([
  auth_middleware,
  IsServerAdmin,
  GetEventFromServer,
]);

export default EventsRouter;
