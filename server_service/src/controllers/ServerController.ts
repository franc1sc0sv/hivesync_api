import { Response } from "express";
import RequestWithUser from "../interfaces/auth_interface";

export const CreateServer = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};

export const DeleteServer = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};

export const EditInfoServer = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};

export const GetAllServers = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};

export const GetDataFromSpecificServer = async (
  _: RequestWithUser,
  res: Response
) => {
  return res.status(200).send("a");
};
