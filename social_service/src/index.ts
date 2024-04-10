import express from "express";
import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library.js";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.get("/", async (_, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      message: "Since social microservice",
      server: 1,
      db: 1,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientInitializationError) {
      return res.status(200).json({
        message: "Since social microservice",
        server: 1,
        db: 0,
      });
    }
    return res.status(200).json({
      message: "Since social microservice",
      server: 0,
      db: 0,
    });
  }
});

app.get("/get_friends", async (_, res) => {
  try {
    const data = await prisma.friends.findMany();
    return res.json(data);
  } catch {
    return res.json({ status: 500, message: "Error del servidor" });
  }
});

app.get("/add_friends", async (_, res) => {
  try {
    const data = await prisma.friends.create({
      data: {
        friend1: "lucy" + crypto.randomUUID(),
        friend2: "FJ" + crypto.randomUUID(),
      },
    });
    return res.json(data);
  } catch (e) {
    console.log(e);
    return res.json({ status: 500, message: "Error del servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`SOCIAL microservice initialized in ${PORT}`);
});
