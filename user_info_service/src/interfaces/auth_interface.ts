import { Request } from "express";
import { User } from "../types/user";

interface RequestWithUser extends Request {
  user: User;
  headers: {
    user?: string;
    [key: string]: any;
  };
}

export default RequestWithUser;
