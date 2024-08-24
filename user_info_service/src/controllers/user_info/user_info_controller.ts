import { PrismaClient } from "@prisma/client";

import { Request, Response } from "express";
import RequestWithUser from "../../interfaces/auth_interface";

import {
  bad_response,
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";

import { UserInput, UserInputInfo } from "../../schemas/user.schema";
import { headers_by_json, postData } from "../../utlis/http_request";
import { AxiosSocialService } from "../../config/axios";

const prisma = new PrismaClient();

const DEFAULT_ABOUT = "Hi, there I'm using Hivesync";

export const post_user_info = async (req: Request, res: Response) => {
  try {
    const raw_data = req.body;
    const parsed_data = UserInputInfo.parse(raw_data);

    const new_user_data = await prisma.userInfo.create({
      data: {
        name: parsed_data.name,
        about: DEFAULT_ABOUT,
        profileUrl: "",
        backgroundUrl: "#45156B",
        id_user: parsed_data.id_user,
        username: parsed_data.username,
      },
    });

    return res
      .status(200)
      .json(good_response({ data: new_user_data, message: "created" }));
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

export const FindUserByNameControllerForFriends = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const rawData = req.body;
    const parsedData = UserInput.parse(rawData);

    const user = await prisma.userInfo.findFirst({
      where: {
        username: parsedData.username,
      },
    });

    if (!user) {
      return res.status(200).json(
        good_response({
          data: {},
          message: "Usuario no encontrado",
        })
      );
    }

    if (user.id_user === req.user?.id) {
      return res.status(200).json(
        good_response({
          data: {},
          message: "Usuario invalido",
        })
      );
    }

    const isFriend = await postData({
      AxiosConfig: AxiosSocialService,
      data: {},
      url: `/friends/verify_friends/${user.id_user}`,
      headers: headers_by_json({ data: req?.user }),
    });

    if (!isFriend?.succes) {
      return res.status(200).json(
        good_response({
          data: {},
          message: "Usuario invalido",
        })
      );
    }

    return res.status(200).json(
      good_response({
        data: { ...user },
        message: "Usuario encontrado",
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

export const GetUserDataByID = async (req: RequestWithUser, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(500).json(
        error_response({
          data: {
            message: "error con los parametros",
          },
        })
      );
    }

    const user = await prisma.userInfo.findFirst({
      where: {
        id_user: id,
      },
      select: {
        id: false,
        profileUrl: true,
        backgroundUrl: true,
        name: true,
        createdAt: true,
        about: true,
      },
    });

    return res.status(200).json(
      good_response({
        data: { ...user },
        message: "Usuario encontrado",
      })
    );
  } catch (error) {
    console.log(error);
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
