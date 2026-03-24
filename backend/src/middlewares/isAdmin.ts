import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { jwtPayload } from "../types/jwtPayload.js";
import { db } from "../db.js";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const decoded = (req as any).user as jwtPayload;
  const user = await db.users.findFirst({ where: { id: decoded.userId } });
  if (!user) {
    return res.status(403).json({ message: "np user found" });
  }
  if (user.role !== "Admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  (req as any).userInfo = user
  next();
};
