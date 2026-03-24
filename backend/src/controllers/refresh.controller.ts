import { db } from "../db.js";
import type { jwtPayload } from "../types/jwtPayload.js";
import jwt from "jsonwebtoken";
import express, { type Request, type Response } from "express";



export const refresh =  async (req: Request, res: Response) => {
     try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return res.status(400).json({ message: "invalid token" });
        }
        const decode = jwt.verify(
          refreshToken,
          process.env.REFRESH_SECRET!,
        ) as jwtPayload;
    
        const user = await db.users.findFirst({ where: { id: decode.userId } });
        if (!user) {
          return res.status(400).json({ message: "refresh token expired" });
        }
        const dbRefreshToken = user?.refreshToken;
        if (dbRefreshToken === refreshToken) {
          // make access token
          const newAccessToken = jwt.sign(
            {
              userId: user?.id,
              role: user?.role,
            },
            process.env.ACCESS_SECRET!,
            { expiresIn: "15m" },
          );
    
          const newRefreshToken = jwt.sign(
            {
              userId: user?.id,
            },
            process.env.REFRESH_SECRET!,
            { expiresIn: "7d" },
          );
          await db.users.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
          });
          res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
          });
          return res.status(200).json({ accessToken: newAccessToken });
        } else {
          return res.status(401).json({ message: "invalid refresh token" });
        }
      } catch (error) {
        return res.status(500).json({ message: "something is wrong" });
      }
}