import { Router } from "express";
import { base_route } from "../controllers/DefaultController";

const DefaultRouter = Router();

DefaultRouter.route("/").get(base_route);

export default DefaultRouter;
