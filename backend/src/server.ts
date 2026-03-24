import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import RegisterRouter from "./routers/register.route.js";
import LoginRouter from "./routers/login.route.js";
import RefreshRouter from "./routers/refresh.route.js";
import LogoutRouter from "./routers/logout.route.js";
import UserMeRouter from "./routers/userMe.route.js";
import UserRouter from "./routers/users.route.js";
import DeleteUser from "./routers/deleteUser.route.js";
import AddPost from "./routers/addPost.router.js";
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
app.use("/register", RegisterRouter);
app.use("/login", LoginRouter);
app.use("/refresh", RefreshRouter);
app.use("/logout", LogoutRouter);
app.use("/users/me", UserMeRouter);
app.use("/users", UserRouter);
app.use("/users", DeleteUser);
app.use("/posts", AddPost);
app.use("/posts", ReadPost);
app.use("/posts/:id", DeletePost);

app.listen(3001, () => {
  console.log("server is running");
});
