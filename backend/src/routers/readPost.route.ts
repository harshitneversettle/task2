import express, { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { addPost } from "../controllers/addPost.controller.js";
import { readPost } from "../controllers/readPost.controller.js";

const ReadPost: express.Router = Router();

ReadPost.get("/", auth, readPost);

export default ReadPost;
