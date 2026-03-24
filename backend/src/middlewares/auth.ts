import type { NextFunction, Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { jwtPayload } from "../types/jwtPayload.js";


const auth = (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "token required" });
  }

  const decoded = jwt.verify(token, process.env.ACCESS_SECRET!) as jwtPayload;

  req.user = decoded;

  // 4. Aage jaane do
  next();
};
