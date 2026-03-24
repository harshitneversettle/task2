import express from "express";
import { hashing } from "./helpers/hash.js";
import { db } from "./db.js";
import validator from "email-validator";
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import type { jwtPayload } from "./types/jwtPayload.js";
dotenv.config();

const app = express();
app.use(express.json());

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

    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ message: "something is wrong" });
  }
});

app.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
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
      return res.status(200).json({
        message: newAccessToken,
      });
    } 
  } catch (error) {
    return res.status(500).json({ message: "something is wrong" });
  }
});

app.listen(3001, () => {
  console.log("server is running");
});
