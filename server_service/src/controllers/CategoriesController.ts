import { Response } from "express";
import RequestWithUser from "../interfaces/auth_interface";
import { PrismaClient } from "@prisma/client";
import { CategorySchema } from "../schemas/categorySchemas";
import {
  bad_response,
  detect_zod_error,
  error_response,
  good_response,
} from "hivesync_utils";
import { ZodError } from "zod";
import RequestServer from "../interfaces/RequestWithServer";
import { deleteData, headers_by_json } from "../utlis/http_request";
import { AxiosChannelsService } from "../../config/axios";

const prisma = new PrismaClient();

export const CreateCategory = async (req: RequestServer, res: Response) => {
  try {
    const validatedData = CategorySchema.parse(req.body);
    const id_server = req.server?.id;
    const category = await prisma.categories.create({
      data: {
        serverId: id_server as string,
        name: validatedData.name,
      },
    });

    return res.status(201).json(
      good_response({
        data: category,
        message: "Categoría creada con éxito",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });

    if (error instanceof ZodError) {
      return res
        .status(400)
        .json(
          error_response({ data: { error: error, message: zod_error?.error } })
        );
    }
    return res.status(500).json(
      error_response({
        data: { error: error },
        message: "Error creando la categoría",
      })
    );
  }
};

export const DeleteCategory = async (req: RequestWithUser, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json(
        bad_response({
          data: {},
          message: "Error eliminando la categoría",
        })
      );
    }

    await prisma.categories.delete({
      where: { id: id },
    });

    await deleteData({
      AxiosConfig: AxiosChannelsService,
      url: `/management/many`,
      headers: headers_by_json({ data: req.user }),
      id: id,
    });

    return res.status(200).json(
      good_response({
        data: {},
        message: "Categoría eliminada con éxito",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });

    if (error instanceof ZodError) {
      return res
        .status(400)
        .json(
          error_response({ data: { error: error, message: zod_error?.error } })
        );
    }
    return res.status(500).json(
      error_response({
        data: { error: error },
        message: "Error eliminando la categoría",
      })
    );
  }
};

export const EditCategory = async (req: RequestWithUser, res: Response) => {
  try {
    const validatedData = CategorySchema.parse(req.body);
    const id_categorie = req.params?.id;

    const updatedCategory = await prisma.categories.update({
      where: { id: id_categorie },
      data: {
        name: validatedData.name,
      },
    });

    return res.status(200).json(
      good_response({
        data: updatedCategory,
        message: "Categoría actualizada con éxito",
      })
    );
  } catch (error) {
    const zod_error = detect_zod_error({ error });

    if (error instanceof ZodError) {
      return res
        .status(400)
        .json(
          error_response({ data: { error: error, message: zod_error?.error } })
        );
    }
    return res.status(500).json(
      error_response({
        data: { error: error },
        message: "Error actualizando la categoría",
      })
    );
  }
};

export const GetAllCategoriesByServer = async (
  req: RequestServer,
  res: Response
) => {
  try {
    const id_server = req.server?.id;

    const categories = await prisma.categories.findMany({
      where: { serverId: id_server },
    });

    return res.status(200).json(
      good_response({
        data: categories,
        message: "Lista de categorías obtenida con éxito",
      })
    );
  } catch (error) {
    return res.status(500).json(
      error_response({
        data: { error: error },
        message: "Error obteniendo la lista de categorías",
      })
    );
  }
};

export const GetCategorie = async (req: RequestWithUser, res: Response) => {
  try {
    const id_categorie = req.params.id;
    const categorie = await prisma.categories.findFirst({
      where: { id: id_categorie },
    });

    return res.status(200).json(
      good_response({
        data: { categorie },
      })
    );
  } catch (error) {
    return res.status(500).json(
      error_response({
        data: {
          error: error,
          message: "Error obteniendo la lista de categorías",
        },
      })
    );
  }
};
