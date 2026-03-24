import { db } from "../db.js";
import { type Request, type Response } from "express";

export const user = async (req: Request, res: Response) => {
  try {
    const user = (req as any).userInfo;

    const alldata = await db.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return res.status(200).json({ alldata });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
