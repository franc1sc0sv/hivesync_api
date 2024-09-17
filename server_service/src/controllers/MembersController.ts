import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import RequestServer from "../interfaces/RequestWithServer";
import {
  API_STATUS,
  custom_response,
  bad_response,
  StatusCodes,
  error_response,
} from "hivesync_utils";
import { z } from "zod";
import {
  AddNewMemberToServerSchema,
  DeleteMemberFromServerSchema,
  RejectInvitationSchema,
} from "../schemas/MembersSchema";
import {
  deleteData,
  getData,
  headers_by_json,
  postData,
} from "../utlis/http_request";
import { NotificationsType } from "../types/notifications";
import {
  AxiosNotificationsService,
  AxiosUserInfoService,
} from "../config/axios";

const prisma = new PrismaClient();

export const AddNewMemberToServer = async (
  req: RequestServer,
  res: Response
) => {
  try {
    const validatedData = AddNewMemberToServerSchema.parse(req.body);
    const { id } = req.params;
    const { id_user, role } = validatedData;

    if (!req.server) {
      return res.status(404).json(
        custom_response({
          data: { message: "Servidor no encontrado" },
          code: StatusCodes.NOT_FOUND,
          status: API_STATUS.FAILED,
        })
      );
    }

    const newMember = await prisma.serverMembers.create({
      data: {
        serverId: id,
        id_user: id_user,
        role: role,
        isActiveInServer: true,
      },
    });

    const json_data = {
      user: { ...req.user },
    };

    const notification: NotificationsType = {
      category: "messages",
      json_data: JSON.stringify(json_data),
      message: `Has sido añadido al servidor ${req.server.name}`,
      to_user_id: id_user,
    };

    await postData({
      AxiosConfig: AxiosNotificationsService,
      data: notification,
      url: "/management",
      headers: headers_by_json({ data: req.user }),
    });

    return res.status(201).json(
      custom_response({
        data: { newMember },
        code: StatusCodes.CREATED,
        status: API_STATUS.OK,
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        bad_response({
          data: { error: error.errors },
          message: "Error de validación de entrada",
        })
      );
    }

    return res.status(500).json(
      bad_response({
        data: { error: error },
        message: "Error al agregar nuevo miembro",
      })
    );
  }
};

export const CreateInvitationServer = async (
  req: RequestServer,
  res: Response
) => {
  try {
    const validatedData = AddNewMemberToServerSchema.parse(req.body);
    const { id } = req.params;
    const { id_user, role } = validatedData;

    if (!req.server) {
      return res.status(404).json(
        custom_response({
          data: { message: "Servidor no encontrado" },
          code: StatusCodes.NOT_FOUND,
          status: API_STATUS.FAILED,
        })
      );
    }

    const isExistingMember = await prisma.serverMembers.findFirst({
      where: { AND: [{ serverId: req.server.id }, { id_user: id_user }] },
    });

    if (isExistingMember) {
      const message = isExistingMember.isActiveInServer
        ? "Miembro ya pertenece al servidor"
        : "Invitacion pendiente";
      return res.status(400).json(
        error_response({
          data: { message },
        })
      );
    }

    const newMember = await prisma.serverMembers.create({
      data: {
        serverId: id,
        id_user: id_user,
        role: role,
        isActiveInServer: false,
      },
    });

    const json_data = {
      id_request: newMember.id,
      user: { ...req.user },
      server: { ...req.server },
    };

    const notification: NotificationsType = {
      category: "invitation",
      json_data: JSON.stringify(json_data),
      message: `Has sido invitado al server ${req.server.name}`,
      to_user_id: id_user,
    };

    await postData({
      AxiosConfig: AxiosNotificationsService,
      data: notification,
      url: "/management",
      headers: headers_by_json({ data: req.user }),
    });

    return res.status(201).json(
      custom_response({
        data: { newMember },
        code: StatusCodes.CREATED,
        status: API_STATUS.OK,
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        bad_response({
          data: { error: error.errors },
          message: "Error de validación de entrada",
        })
      );
    }

    return res.status(500).json(
      bad_response({
        data: { error: error },
        message: "Error al agregar nuevo miembro",
      })
    );
  }
};

export const DeleteMemberFromServer = async (
  req: RequestServer,
  res: Response
) => {
  try {
    const validatedData = DeleteMemberFromServerSchema.parse(req.body);
    const { id } = req.params;
    const { id_user } = validatedData;

    if (!req.server) {
      return res.status(404).json(
        custom_response({
          data: { message: "Servidor no encontrado" },
          code: StatusCodes.NOT_FOUND,
          status: API_STATUS.FAILED,
        })
      );
    }

    const deleteMember = await prisma.serverMembers.deleteMany({
      where: {
        id_user: id_user,
        serverId: id,
      },
    });

    if (deleteMember.count === 0) {
      return res.status(404).json(
        custom_response({
          data: { message: "Miembro no encontrado" },
          code: StatusCodes.NOT_FOUND,
          status: API_STATUS.FAILED,
        })
      );
    }

    const json_data = {
      user: { ...req.user },
    };

    const notification: NotificationsType = {
      category: "messages",
      json_data: JSON.stringify(json_data),
      message: `Has sido eliminado del servidor ${req.server.name}`,
      to_user_id: id_user,
    };

    await postData({
      AxiosConfig: AxiosNotificationsService,
      data: notification,
      url: "/management",
      headers: headers_by_json({ data: req.user }),
    });

    return res.status(200).json(
      custom_response({
        data: { message: "Miembro eliminado con éxito" },
        code: StatusCodes.OK,
        status: API_STATUS.OK,
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        bad_response({
          data: { error: error.errors },
          message: "Error de validación de entrada",
        })
      );
    }

    return res.status(500).json(
      bad_response({
        data: { error: error },
        message: "Error al eliminar miembro",
      })
    );
  }
};

export const RejectInvitation = async (req: RequestServer, res: Response) => {
  try {
    const validatedData = RejectInvitationSchema.parse(req.body);
    const { id } = req.params;
    const id_user = req.user?.id;

    if (!req.server) {
      return res.status(404).json(
        custom_response({
          data: { message: "Servidor no encontrado" },
          code: StatusCodes.NOT_FOUND,
          status: API_STATUS.FAILED,
        })
      );
    }

    await prisma.serverMembers.deleteMany({
      where: {
        id_user: id_user,
        serverId: id,
      },
    });

    await deleteData({
      AxiosConfig: AxiosNotificationsService,
      id: validatedData.notification_id,
      url: "/management",
      headers: headers_by_json({ data: req.user }),
    });

    const json_data = {
      user: { ...req.user },
    };

    const notification: NotificationsType = {
      category: "messages",
      json_data: JSON.stringify(json_data),
      message: `Has rechazado la invitacion del servidor ${req.server.name}`,
      to_user_id: id_user as string,
    };

    await postData({
      AxiosConfig: AxiosNotificationsService,
      data: notification,
      url: "/management",
      headers: headers_by_json({ data: req.user }),
    });

    return res.status(200).json(
      custom_response({
        data: { message: "Invitación rechazada con éxito" },
        code: StatusCodes.OK,
        status: API_STATUS.OK,
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        bad_response({
          data: { error: error.errors },
          message: "Error de validación de entrada",
        })
      );
    }

    return res.status(500).json(
      bad_response({
        data: { error: error },
        message: "Error al rechazar la invitación",
      })
    );
  }
};

export const AccepInvitationServer = async (
  req: RequestServer,
  res: Response
) => {
  try {
    const validatedData = RejectInvitationSchema.parse(req.body);
    const { id } = req.params;
    const id_user = req.user?.id;

    if (!req.server) {
      return res.status(404).json(
        custom_response({
          data: { message: "Servidor no encontrado" },
          code: StatusCodes.NOT_FOUND,
          status: API_STATUS.FAILED,
        })
      );
    }

    const memberData = await prisma.serverMembers.findFirst({
      where: {
        AND: [{ id_user: id_user }, { serverId: id }],
      },
    });

    const newMember = await prisma.serverMembers.update({
      where: {
        id: memberData?.id,
      },
      data: {
        isActiveInServer: true,
      },
    });

    await deleteData({
      AxiosConfig: AxiosNotificationsService,
      id: validatedData.notification_id,
      url: "/management",
      headers: headers_by_json({ data: req.user }),
    });

    const json_data = {
      user: { ...req.user },
    };

    const notification: NotificationsType = {
      category: "messages",
      json_data: JSON.stringify(json_data),
      message: `Has sido añadido al servidor ${req.server.name}`,
      to_user_id: id_user as string,
    };

    await postData({
      AxiosConfig: AxiosNotificationsService,
      data: notification,
      url: "/management",
      headers: headers_by_json({ data: req.user }),
    });

    return res.status(201).json(
      custom_response({
        data: { newMember },
        code: StatusCodes.CREATED,
        status: API_STATUS.OK,
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        bad_response({
          data: { error: error.errors },
          message: "Error de validación de entrada",
        })
      );
    }

    return res.status(500).json(
      bad_response({
        data: { error: error },
        message: "Error al agregar nuevo miembro",
      })
    );
  }
};

export const GetServerMembersFromServer = async (
  req: RequestServer,
  res: Response
) => {
  try {
    if (!req.server) {
      return res.status(404).json(
        custom_response({
          data: { message: "Servidor no encontrado" },
          code: StatusCodes.NOT_FOUND,
          status: API_STATUS.FAILED,
        })
      );
    }

    const members = await prisma.serverMembers.findMany({
      where: { AND: [{ serverId: req.server.id }, { isActiveInServer: true }] },
      include: { server: true },
    });

    const newMembersFormated: any = [...members];

    for (const member of newMembersFormated) {
      const id_user = member.id_user;

      try {
        const user_data = await getData({
          AxiosConfig: AxiosUserInfoService,
          url: `/user/${id_user}`,
          headers: headers_by_json({ data: req.user }),
        });

        member.user = user_data;
      } catch (error) {
        console.error(
          `Error fetching user data for user ID ${id_user}:`,
          error
        );
      }
    }

    return res.status(200).json(
      custom_response({
        data: newMembersFormated,
        code: StatusCodes.OK,
        status: API_STATUS.OK,
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        bad_response({
          data: { error: error.errors },
          message: "Error de validación de entrada",
        })
      );
    }

    console.log(error);

    return res.status(500).json(
      bad_response({
        data: { error: error },
        message: "Error al obtener los miembros del servidor",
      })
    );
  }
};
