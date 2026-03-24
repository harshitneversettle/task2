import express, { Router } from "express";
import { register } from "../controllers/register.controller.js";
import { ratelimiter } from "../middlewares/rateLimiter.js";
import { login } from "../controllers/login.controller.js";

const LoginRouter: express.Router = Router();

LoginRouter.post("/", ratelimiter, login);

export default LoginRouter;
