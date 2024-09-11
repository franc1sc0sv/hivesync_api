import { PrismaClient } from "@prisma/client";

import { getData } from "../utlis/http_request";
import { AxiosUserInfoService } from "../config/axios";
import { User } from "../types/user";

const prisma = new PrismaClient();

export const get_data_user = async (user_id: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      return null;
    }

    const user_data = await getData({
      AxiosConfig: AxiosUserInfoService,
      url: `/user/${user.id}`,
    });

    const data = { ...user, ...user_data } as User;
    return data;
  } catch (error) {
    return {};
  }
};
