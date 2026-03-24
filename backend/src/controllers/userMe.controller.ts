import { db } from "../db.js";
import { type Request, type Response } from "express";
import type { jwtPayload } from "../types/jwtPayload.js";

export const userMe = async (req: Request, res: Response) => {
  try {
    const decoded = (req as any).user as jwtPayload;
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await db.users.findFirst({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
