import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { expressjwt } from "express-jwt";

export const requireAuth = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
