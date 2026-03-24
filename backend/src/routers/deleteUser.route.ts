import express, { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { user } from "../controllers/user.controller.js";
import { deleteUser } from "../controllers/deleteUser.controller.js";

const DeleteUser: express.Router = Router();

DeleteUser.delete("/", auth , isAdmin, deleteUser);

export default DeleteUser;
