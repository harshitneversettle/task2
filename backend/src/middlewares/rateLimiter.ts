import { rateLimit } from "express-rate-limit";

export const ratelimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: "Too many requests, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});
