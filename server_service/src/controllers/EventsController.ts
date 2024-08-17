import { Response } from "express";
import RequestWithUser from "../interfaces/auth_interface";

export const CreateEvent = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};

export const DeleteEvent = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};

export const EditEvent = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};

export const GetAllEventsFromServer = async (
  _: RequestWithUser,
  res: Response
) => {
  return res.status(200).send("a");
};

export const GetEventFromServer = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};
