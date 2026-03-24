import express, { type Request, type Response } from "express";
import { hashing } from "./helpers/hash.js";
import { db } from "./db.js";
import validator from "email-validator";
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { auth } from "./middlewares/auth.js";
import type { jwtPayload } from "./types/jwtPayload.js";
import cookieParser from "cookie-parser";
import { isAdmin } from "./middlewares/isAdmin.js";
import rateLimit from "express-rate-limit";
import { ratelimiter } from "./middlewares/rateLimiter.js";
import cors from "cors";
import router from "./routers/register.route.js";
import RegisterRouter from "./routers/register.route.js";
import LoginRouter from "./routers/login.route.js";
import RefreshRouter from "./routers/refresh.route.js";
import LogoutRouter from "./routers/logout.route.js";
import UserMeRouter from "./routers/userMe.route.js";
import UserRouter from "./routers/users.route.js";
import DeleteUser from "./routers/deleteUser.route.js";
import AddPost from "./routers/addPost.route.js";
import ReadPost from "./routers/readPost.route.js";
import DeletePost from "./routers/deletePost.route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.get("/", (req, res) => {
  console.log("jansjn");
});

app.use("/register", RegisterRouter);
app.use("/login", LoginRouter);
app.use("/refresh", RefreshRouter);
app.use("/logout", LogoutRouter);
app.use("/users/me", UserMeRouter);
app.use("/users", UserRouter);
app.use("/users/:id", DeleteUser);
app.use("/posts", AddPost);
app.use("/posts", ReadPost);
app.use("/posts/:id", DeletePost);

app.listen(3001, () => {
  console.log("server is running");
});
