import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { jwtPayload } from "../types/jwtPayload.js";
import { db } from "../db.js";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "token required" });
  }

  const decoded = jwt.verify(token, process.env.ACCESS_SECRET!) as jwtPayload;
  req.body.user = decoded;
  next();
};
