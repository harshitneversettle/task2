import express, { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { addPost } from "../controllers/addPost.controller.js";

const AddPost: express.Router = Router();

AddPost.post("/", auth, addPost);

export default AddPost;
