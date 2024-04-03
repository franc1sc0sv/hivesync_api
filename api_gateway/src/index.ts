import express from "express";
import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

app.get("/", async (_, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      message: "Hi from HiveSync API",
      server: 1,
      db: 1,
    });
  } catch (error) {
    console.log(error)
    if (error instanceof PrismaClientInitializationError) {
      return res.status(200).json({
        message: "Hi from HiveSync API",
        server: 1,
        db: 0,
      });
    }
    return res.status(200).json({
      message: "Hi from HiveSync API",
      server: 0,
      db: 0,
    });
  }
});

app.get("/get_users", async (_, res) => {
  try {
    const data = await prisma.user.findMany()
    return res.json(data)
  } catch {
    return res.json({ status: 500, message: "Error del servidor" })
  }
})

app.get("/create_user", async (_, res) => {
  try {
    const data = await prisma.user.create({
      data: {
        email: `lucy${Math.random()}@gmail.com`,
        name: "Lucy <3"
      }
    })
    return res.json(data)
  } catch (e) {
    console.log(e)
    return res.json({ status: 500, message: "Error del servidor" })
  }
})

app.listen(PORT, () => {
  console.log(`API GATEWAY initialized in ${PORT}`);
});
