import dotenv from "dotenv";
dotenv.config({ path: ".env.prod" });
import mongoose from "mongoose";

export function initDatabase() {
  const DATABASE_URL = "mongodb://localhost:27017/chat";
  const PROD_DB = process.env.PROD_DB;
  mongoose.connection.on("open", () => {
    console.info("Successfully connected to database:", PROD_DB);
  });
  const connection = mongoose.connect(PROD_DB);
  return connection;
}
