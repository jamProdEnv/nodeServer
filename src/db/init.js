import dotenv from "dotenv";
dotenv.config({ path: ".env.prod" });
dotenv.config();
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";

export function initDatabase() {
  // const DATABASE_URL = "mongodb://localhost:27017/chat";
  const DATABASE_URL = process.env.LOCAL_URL;
  // const PROD_DB = process.env.PROD_DB;
  mongoose.connection.on("open", () => {
    console.info("Successfully connected to database:", DATABASE_URL);
  });
  const connection = mongoose.connect(DATABASE_URL);
  return connection;
}
