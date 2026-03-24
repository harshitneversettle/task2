import { type Request, type Response } from "express";
import validator from "email-validator";
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { db } from "../db.js";


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const isValid = validator.validate(email);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const user = await db.users.findFirst({ where: { email: email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessTokenOptions: SignOptions = {
      expiresIn: "15m",
    };

    const refreshTokenOptions: SignOptions = {
      expiresIn: "7d",
    };

    const accessToken = jwt.sign(
      { userId: user.id, userRole: user.role },
      process.env.ACCESS_SECRET!,
      accessTokenOptions,
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_SECRET!,
      refreshTokenOptions,
    );

    await db.users.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(500).json({ message: "something is wrong" });
  }
};
