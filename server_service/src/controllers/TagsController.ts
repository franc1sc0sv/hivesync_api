import { Response } from "express";
import RequestWithUser from "../interfaces/auth_interface";

export const CreateTag = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};

export const DeleteTag = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};

export const EditTag = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};

export const GetAllTags = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};
