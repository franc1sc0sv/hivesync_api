import { Response } from "express";
import RequestWithUser from "../interfaces/auth_interface";

export const GetFriendsByUser = async (req: RequestWithUser, res: Response) => {
  const a = req.user;
  return res.status(200).send(a);
};

export const AcceptFriendRequest = async (
  _: RequestWithUser,
  res: Response
) => {
  return res.status(200).send("a");
};

export const DeleteFriend = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};
