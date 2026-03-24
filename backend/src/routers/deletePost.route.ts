import express, { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { addPost } from "../controllers/addPost.controller.js";
import { readPost } from "../controllers/readPost.controller.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { deletePost } from "../controllers/deletePost.controller.js";

const DeletePost: express.Router = Router();

DeletePost.delete("/", auth , isAdmin, deletePost);

export default DeletePost;
