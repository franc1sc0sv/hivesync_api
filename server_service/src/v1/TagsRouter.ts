import { Router } from "express";
import { GetAllTagsByServer } from "../controllers/TagsController";
import { auth_middleware } from "../middleware/auth";

const TagsRouter = Router();

TagsRouter.route("/:id").get([auth_middleware, GetAllTagsByServer]);

export default TagsRouter;
