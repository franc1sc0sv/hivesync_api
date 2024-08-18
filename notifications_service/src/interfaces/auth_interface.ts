import { Request } from "express";

interface RequestWithUser extends Request {
  user: User;
  headers: {
    user?: string;
    [key: string]: any;
  };
}

export default RequestWithUser;
