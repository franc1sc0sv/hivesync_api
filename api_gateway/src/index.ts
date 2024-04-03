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
      server: 1,
      db: 1,
    });
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      return res.status(200).json({
        server: 1,
        db: 0,
      });
    }
    return res.status(200).json({
      server: 0,
      db: 0,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server initialized in ${PORT}`);
});
