import { Router } from "express";
import { auth_middleware } from "../middleware/auth";
import { IsServerAdmin } from "../middleware/IsServerAdmin";
import {
  CreateCategory,
  DeleteCategory,
  EditCategory,
  GetAllCategoriesByServer,
} from "../controllers/CategoriesController";

const CategoriesRouter = Router();

CategoriesRouter.route("/")
  .post([auth_middleware, IsServerAdmin, CreateCategory])
  .delete([auth_middleware, DeleteCategory])
  .patch([auth_middleware, IsServerAdmin, EditCategory])
  .get([auth_middleware, IsServerAdmin, GetAllCategoriesByServer]);

export default CategoriesRouter;
