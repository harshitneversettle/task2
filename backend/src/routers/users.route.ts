import express, { Router } from "express";
import { register } from "../controllers/register.controller.js";
import { ratelimiter } from "../middlewares/rateLimiter.js";
import { login } from "../controllers/login.controller.js";
import { refresh } from "../controllers/refresh.controller.js";
import { auth } from "../middlewares/auth.js";
import { logout } from "../controllers/logout.controller.js";
import { userMe } from "../controllers/userMe.controller.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { user } from "../controllers/user.controller.js";

const UserRouter: express.Router = Router();

UserRouter.get("/", auth , isAdmin, user);

export default UserRouter;
