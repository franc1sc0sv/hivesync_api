import { PrismaClient } from "@prisma/client";

import { Request, Response } from "express";

import {
  bad_response,
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";

import { UserInputInfo } from "../../schemas/user.schema";
import { UserInfo } from "../../types/user";

const prisma = new PrismaClient();

const DEFAULT_ABOUT = "Hi, there I'm using Hivesync";

export const post_user_info = async (req: Request, res: Response) => {
  try {
    const raw_data = req.body;
    const parsed_data = UserInputInfo.parse(raw_data);

    const user_info: UserInfo = {
      name: parsed_data.name,
      about: DEFAULT_ABOUT,
      profileUrl: "",
      backgroundUrl: "#486CFF",
      id_user: parsed_data.id_user,
    };

    const new_user_data = await prisma.userInfo.create({ data: user_info });

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
