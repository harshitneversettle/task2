import express, { Router } from "express";
import { register } from "../controllers/register.controller.js";
import { ratelimiter } from "../middlewares/rateLimiter.js";
import { login } from "../controllers/login.controller.js";
import { refresh } from "../controllers/refresh.controller.js";

const RefreshRouter: express.Router = Router();

RefreshRouter.post("/", ratelimiter, refresh);

export default RefreshRouter;
