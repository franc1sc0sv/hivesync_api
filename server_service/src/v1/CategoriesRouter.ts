import { Router } from "express";
import { auth_middleware } from "../middleware/auth";
import { IsServerAdmin } from "../middleware/IsServerAdmin";
import {
  CreateCategory,
  DeleteCategory,
  EditCategory,
  GetAllCategoriesByServer,
  GetCategorie,
} from "../controllers/CategoriesController";

const CategoriesRouter = Router();

CategoriesRouter.route("/:id")
  .post([auth_middleware, IsServerAdmin, CreateCategory])
  .get([auth_middleware, IsServerAdmin, GetAllCategoriesByServer])
  .delete([auth_middleware, DeleteCategory])
  .patch([auth_middleware, EditCategory]);

CategoriesRouter.route("/get_one/:id").get([auth_middleware, GetCategorie]);

export default CategoriesRouter;
