import { Request, Response } from "express";
import { good_response } from "../../utlis/api_response_utils";

export const login_controller = (_: Request, res: Response) => {
  return res.status(200).json(good_response({ data: [] }));
};
export const register_controller = (_: Request, res: Response) => {
  return res.status(200).json(good_response({ data: [] }));
};
export const get_profile_controller = (_: Request, res: Response) => {
  return res.status(200).json(good_response({ data: [] }));
};
