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

// EventsRouter.route("/")

EventsRouter.route("/:id")
  .get([auth_middleware, IsServerAdmin, GetEventFromServer,])
  .post([auth_middleware, IsServerAdmin, CreateEvent])
  .patch([auth_middleware, IsServerAdmin, EditEvent])
  .delete([auth_middleware, IsServerAdmin, DeleteEvent]);

EventsRouter.route("/get_many/:id")
  .get([auth_middleware, IsServerAdmin, GetAllEventsFromServer]);


export default EventsRouter;
