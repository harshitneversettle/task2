import { db } from "../db.js";
import { type Request, type Response } from "express";

export const deletePost = async (req: Request, res: Response) => {
  try {
    const numId = Number(req.params.id);

    const post = await db.posts.findFirst({ where: { id: numId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await db.posts.delete({ where: { id: numId } });
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
