import { Request } from "express";
import { User } from "../types/user";

interface RequestWithUser extends Request {
  user?: User;
}

export default RequestWithUser;
