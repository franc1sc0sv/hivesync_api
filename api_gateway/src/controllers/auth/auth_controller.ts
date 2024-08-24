import { Response } from "express";

import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  UserInputLoginSc,
  UserInputRegisterInfoSc,
  UserInputRegisterSc,
} from "../../schemas/user.schema";

import { User, UserInputLogin, UserInputRegister } from "../../types/user";

import RequestWithUser from "../../interfaces/auth_interface";

import {
  bad_response,
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";
import { postData } from "../../utlis/http_request";
import { AxiosUserInfoService } from "../../config/axios";

const prisma = new PrismaClient();

export const login_controller = async (req: RequestWithUser, res: Response) => {
  try {
    const raw_data: UserInputLogin = req.body;
    const parsed_data = UserInputLoginSc.parse(raw_data);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: parsed_data.user,
          },
          {
            username: parsed_data.user,
          },
        ],
      },
    });

    if (!user)
      return res.status(400).json(
        error_response({
          data: {
            message: "cuenta no existe",
          },
        })
      );

    const valid_password = await bcrypt.compare(
      parsed_data.password,
      user.password
    );

    if (!valid_password)
      return res.status(400).json(
        error_response({
          data: {
            message: "contraseña incorrecta",
          },
        })
      );

    const JWT_SECRET = process.env.JWT_SECRET;

    const token = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET as string
    );

    return res.status(200).json(
      good_response({
        data: { ...user, token },
        message: "user l",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });
    if (zod_error?.error)
      return res
        .status(400)
        .json(
          error_response({ data: { error: error, message: zod_error.error } })
        );

    return res.status(500).json(
      bad_response({
        data: {
          message: "error en el servidor",
          error: error,
        },
      })
    );
  }
};

export const register_controller = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const raw_data: UserInputRegister = req.body;
    const parsed_data = UserInputRegisterSc.parse(raw_data);
    const parsed_data_user_info = UserInputRegisterInfoSc.parse(raw_data);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: parsed_data.email,
          },
          {
            username: parsed_data.username,
          },
        ],
      },
    });

    if (user)
      return res.status(400).json(
        error_response({
          data: {
            message: "email o usuario ya existe",
          },
        })
      );

    const salt = await bcrypt.genSalt(10);
    const new_password = await bcrypt.hash(parsed_data.password, salt);

    const user_data: UserInputRegister = {
      ...parsed_data,
      password: new_password,
    };

    const new_user = await prisma.user.create({ data: user_data });

    const user_info_data = {
      name: parsed_data_user_info.name,
      id_user: new_user.id,
      username: new_user.username,
    };

    await postData({
      url: "/user",
      data: user_info_data,
      AxiosConfig: AxiosUserInfoService,
    });

    return res.status(200).json(
      good_response({
        data: { ...new_user },
        message: "user created",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });
    if (zod_error?.error)
      return res
        .status(400)
        .json(
          error_response({ data: { error: error, message: zod_error.error } })
        );

    return res.status(500).json(
      bad_response({
        data: {
          message: "error en el servidor",
          error: error,
        },
      })
    );
  }
};

export const get_profile_controller = (req: RequestWithUser, res: Response) => {
  return res.status(200).json(good_response({ data: req.user as User }));
};
