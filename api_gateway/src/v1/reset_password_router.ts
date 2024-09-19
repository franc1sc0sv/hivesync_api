import { Router } from "express";
import { requestPasswordReset } from "../controllers/reset_password/requestPasswordReset"; 
import { resetPassword } from "../controllers/reset_password/resetPassword"; 

const resetPasswordRouter = Router();

resetPasswordRouter.route("/request").post(requestPasswordReset);
resetPasswordRouter.route("/reset").post(resetPassword);

export default resetPasswordRouter;