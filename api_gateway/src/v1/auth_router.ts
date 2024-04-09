import { Router } from "express";
import {
  login_controller,
  register_controller,
  get_profile_controller,
} from "../controllers/auth/auth_controller";

const auth_router = Router();

auth_router.route("/register").post(register_controller);
auth_router.route("/login").get(login_controller);
auth_router.route("/profile").get(get_profile_controller);

export default auth_router;
