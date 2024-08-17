import { Response } from "express";
import RequestWithUser from "../interfaces/auth_interface";

export const InviteUsers = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};

export const DeleteMemberFromService = async (
  _: RequestWithUser,
  res: Response
) => {
  return res.status(200).send("a");
};

export const GetServerMembers = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};
