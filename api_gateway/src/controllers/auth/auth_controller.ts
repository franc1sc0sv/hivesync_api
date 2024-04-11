import { Response } from "express";

import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  bad_response,
  error_response,
  good_response,
} from "../../utlis/api_response_utils";

import {
  UserInputLoginSc,
  UserInputRegisterSc,
} from "../../schemas/user.schema";
import { UserInputLogin, UserInputRegister } from "../../types/user";

import { detect_zod_error } from "../../utlis/zod_utils";
import RequestWithUser from "../../../interfaces/auth_interface";

const prisma = new PrismaClient();

export const login_controller = async (req: RequestWithUser, res: Response) => {
  const raw_data: UserInputLogin = req.body;
  const parsed_data = UserInputLoginSc.parse(raw_data);

  const user = await prisma.user.findFirst({
    where: {
      email: parsed_data.email,
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
};

export const register_controller = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const raw_data: UserInputRegister = req.body;
    const parsed_data = UserInputRegisterSc.parse(raw_data);

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
            message: "email o username ya existe",
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

    return res.status(200).json(
      good_response({
        data: new_user,
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
  return res.status(200).json(good_response({ data: req.user }));
};
