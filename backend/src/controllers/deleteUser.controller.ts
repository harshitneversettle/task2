import { db } from "../db.js";
import { type Request, type Response } from "express";

export const deleteUser = async (req: Request, res: Response) => {
  try {
    console.log("params:", req.params);
    console.log("url:", req.url);
    const { id } = req.params;
    const numId = Number(id);
    console.log(id);
    if (!id || isNaN(numId)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }
    const user = await db.users.findFirst({ where: { id: numId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await db.users.delete({ where: { id: numId } });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
