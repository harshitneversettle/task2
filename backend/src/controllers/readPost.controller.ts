import { db } from "../db.js";
import { type Request, type Response } from "express";
import type { jwtPayload } from "../types/jwtPayload.js";

export const readPost = async (req: Request, res: Response) => {
  try {
    const decode = (req as any).user as jwtPayload;
    const allPost = await db.posts.findMany({
      where: {
        userId: decode.userId,
      },
    });
    return res.status(200).json({ posts: allPost });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
