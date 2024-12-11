import express from "express";
import dotenv from "dotenv";
// routers
import { authRouter } from "./routes/auth.routes.js";
import { postRouter } from "./routes/post.routes.js";
import { bookRouter } from "./routes/book.routes.js";
import { collegeRouter } from "./routes/college.routes.js";
import cors from "cors";
import { sessions } from "./middlewares/session.js";
import { userRouter } from "./routes/user.routes.js";
import { savedPostsRouter } from "./routes/saved_posts.routes.js";
dotenv.config({ path: "config.env" });
export const app = express();
  app.use(sessions());
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));
  app.use(cors({
    origin: ["https://bookappfrontend-three.vercel.app/", "https://bookappfrontend-three.vercel.app"],
    credentials: true
  }));
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/post", postRouter);
  app.use("/api/v1/book", bookRouter);
  app.use("/api/v1/college", collegeRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/bookmark", savedPostsRouter);
  app.use("/api/v1/static", express.static("public"))
