import { Response } from "express";
import RequestWithUser from "../interfaces/auth_interface";

export const CreateCategory = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};

export const DeleteCategory = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};

export const EditCategory = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};

export const GetAllCategories = async (_: RequestWithUser, res: Response) => {
  return res.status(200).send("a");
};
