import { db } from "../db.js";
import { type Request, type Response } from "express";
import type { jwtPayload } from "../types/jwtPayload.js";

export const logout = async (req: Request, res: Response) => {
  try {

    const decoded = (req as any).user as jwtPayload;
    if (!decoded) {
      return res.status(401).json({ message: "error" });
    }
    const user = await db.users.findFirst({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(401).json({ message: "error" });
    }

    await db.users.update({
      where: { id: user.id },
      data: { refreshToken: null },
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "successfyllu logget out" });
  } catch (error) {
    return res.status(500).json({ message: "something is wrong" });
  }
};
