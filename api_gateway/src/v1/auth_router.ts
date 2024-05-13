import { Router } from "express";
import {
  login_controller,
  register_controller,
  get_profile_controller,
} from "../controllers/auth/auth_controller";
import { auth_middleware } from "../middleware/auth";

const auth_router = Router();

auth_router.route("/register").post(register_controller);
auth_router.route("/login").post(login_controller);
auth_router.route("/profile").get(auth_middleware(), get_profile_controller);

export default auth_router;
