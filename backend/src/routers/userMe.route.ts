import express, { Router } from "express";
import { register } from "../controllers/register.controller.js";
import { ratelimiter } from "../middlewares/rateLimiter.js";
import { login } from "../controllers/login.controller.js";
import { refresh } from "../controllers/refresh.controller.js";
import { auth } from "../middlewares/auth.js";
import { logout } from "../controllers/logout.controller.js";
import { userMe } from "../controllers/userMe.controller.js";

const UserMeRouter: express.Router = Router();

UserMeRouter.get("/", auth, userMe);

export default UserMeRouter;
