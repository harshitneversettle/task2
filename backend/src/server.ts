import express from "express";
import { hashing } from "./helpers/hash.js";
import { db } from "./db.js";
import validator from "email-validator";
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { auth } from "./middlewares/auth.js";
import type { jwtPayload } from "./types/jwtPayload.js";
import cookieParser from "cookie-parser";
import { isAdmin } from "./middlewares/isAdmin.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  console.log("jansjn");
});

app.post("/register", async (req, res) => {
  console.log("insode");
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const isValid = validator.validate(email);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "password should be strong",
      });
    }
    const hashedPass = await hashing(password);
    const exist = await db.users.findFirst({
      where: { email: email },
    });
    if (exist) {
      return res.status(409).json({ message: "User already exists" });
    }
    await db.users.create({
      data: {
        name: name,
        email: email,
        password: hashedPass,
      },
    });
    return res.status(201).json({ message: "ok" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "something is wrong" });
  }
});

app.post("/login", async (req, res) => {
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
});

app.post("/refresh", async (req, res) => {
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
});

app.post("/logout", auth, async (req, res) => {
  try {
    console.log(req.body);

    const decoded = req.body.user as jwtPayload;
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
});

app.get("/users/me", auth, async (req, res) => {
  try {
    const decoded = req.body.user as jwtPayload;
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
});

app.get("/users", auth, isAdmin, async (req, res) => {
  try {
    const user = req.body.userInfo;

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
});

app.delete("/users/:id", auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const numId = Number(id);
    const user = await db.users.findFirst({ where: { id: numId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await db.users.delete({ where: { id: numId } });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3001, () => {
  console.log("server is running");
});
