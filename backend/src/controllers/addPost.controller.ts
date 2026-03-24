import { db } from "../db.js";
import { type Request, type Response } from "express";
import type { jwtPayload } from "../types/jwtPayload.js";

export const addPost = async (req: Request, res: Response) => {
   try {
     const { title, description } = req.body;
     if (!title || !description) {
       return res.status(400).json({ message: "All fields are required" });
     }
     const decoded = (req as any).user as jwtPayload;
 
     const newPost = await db.posts.create({
       data: {
         title,
         description,
         userId: decoded.userId,
       },
     });
     return res.status(201).json({ post: newPost });
   } catch (error) {
     console.log(error);
     return res.status(500).json({ message: "Internal server error" });
   }
};
