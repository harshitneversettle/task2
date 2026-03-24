import type { Request, Response } from "express";
import { db } from "../db.js";
import { hashing } from "../helpers/hash.js";
import validator from "email-validator";


export const register = async (req: Request, res: Response) => {
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
    return res.status(500).json({ message: "something is wrong" });
  }
};
