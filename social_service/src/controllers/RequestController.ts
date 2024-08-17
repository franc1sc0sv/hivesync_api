import { Response } from "express";
import RequestWithUser from "../interfaces/auth_interface";

export const RejectRequestController = async (
  _: RequestWithUser,
  res: Response
) => {
  return res.status(200).send("a");
};

export const CreateRequestController = async (
  _: RequestWithUser,
  res: Response
) => {
  return res.status(200).send("a");
};
