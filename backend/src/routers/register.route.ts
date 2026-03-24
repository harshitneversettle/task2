import express, { Router } from "express";
import { register } from "../controllers/register.controller.js";
import { ratelimiter } from "../middlewares/rateLimiter.js";

const RegisterRouter: express.Router = Router();

RegisterRouter.post("/", ratelimiter, register);

export default RegisterRouter;
