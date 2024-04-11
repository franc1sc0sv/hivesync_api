import { Request } from "express";
import { User } from "../src/types/user";

interface RequestWithUser extends Request {
  user?: User;
}

export default RequestWithUser;
